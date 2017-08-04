import * as Promise from 'bluebird';
import * as _ from 'lodash';
import * as shortid from 'shortid';
import { WorkOrderResult } from '../result/WorkOrderResult';
import { STATUS } from '../status';
import { Step } from '../step/Step';
import { WorkFlow } from '../workflow/WorkFlow';
import { WorkOrder } from '../workorder/WorkOrder';
import { DataService } from './DataService';
import { ResultService } from './ResultService';
import { UserService } from './UserService';

interface CompleteStepParams {
  /** The ID of the workorder to complete the step for */
  workorderId: string;
  /** The submission to save */
  submission: object;
  /** The ID of the step to save the submission for */
  stepCode: string;
}

export class WfmService {

  constructor(
    protected workorderService: DataService<WorkOrder>,
    protected workflowService: DataService<WorkFlow>,
    protected resultService: ResultService,
    protected userService: UserService
  ) {
  }

  /**
   * Beginning a workflow for a single Workorder.
   *
   * @param {string} workorderId - The ID of the workorder to begin the workflow for.
   */
  public beginWorkflow(workorderId) {
    return this.workorderSummary(workorderId).then(summary => {
      const workorder = summary.workorder;
      const workflow = summary.workflow;
      const res = summary.result || this.createNewResult(workorderId, workorder.assignee);

      // When the result has been read/created, then we can move on.
      return Promise.resolve(res).then(result => {
        // Now we check the current status of the workflow to see where the next step should be.
        const stepReview = this.executeStepReview(workflow.steps, result);

        result.nextStepIndex = stepReview.nextStepIndex;
        result.status = this.checkStatus(workorder, workflow, result);

        // We now have the current status of the workflow for this workorder, the begin step is now complete.
        return {
          workorder,
          workflow,
          result,
          nextStepIndex: result.nextStepIndex,
          step: result.nextStepIndex > -1 ? workflow.steps[result.nextStepIndex] : workflow.steps[0]
        };
      });
    });
  }

  /**
   * Gets a summary of the workflow.
   * This will get all of the details related to the workorder, including workflow and result data.
   *
   * @param {string} workorderId - The ID of the workorder to get the summary for.
   * @return {{workflow: Workflow, workorder: Workorder, result: Result}}
   * An object containing all the major entities related to the workorder
   */
  public workorderSummary(workorderId) {
    const self = this;
    return this.workorderService.read(workorderId)
      .then(function(workorder) {
        return Promise.all([
          self.workflowService.read(workorder.workflowId),
          self.resultService.readByWorkorder(workorderId)
        ]).then(function(response) {
          const workflow = response[0];
          const result = response[1];
          return {
            workflow,
            workorder,
            result
          };
        });
      });
  }

  /**
   *
   * Going to the previous step of a workorder.
   *
   * @param workorderId - The ID of the workorder to switch to the previous step for
   */
  public previousStep(workorderId) {
    const self = this;
    return this.workorderSummary(workorderId).then(function(summary) {
      const workorder = summary.workorder;
      const workflow = summary.workflow;
      const result = summary.result;

      if (!result) {
        // No result exists, The workflow should have been started
        return Promise.reject(new Error('No result exists for workflow ' + workorderId +
          '. The workflow back topic can only be used for a workflow that has begun'));
      }

      // -1 is a special value for 'no next step'
      result.nextStepIndex = _.max([result.nextStepIndex - 1, -1]) || -1; // _.max returns `number?`

      return self.resultService.update(result).then(function() {
        return {
          workorder,
          workflow,
          result,
          nextStepIndex: result.nextStepIndex,
          step: result.nextStepIndex > -1 ? workflow.steps[result.nextStepIndex] : null
        };
      });
    });
  }

  /**
   * Completing a single step for a workorder.
   */
  public completeStep(parameters: CompleteStepParams) {
    const workorderId = parameters.workorderId;
    const stepCode = parameters.stepCode;
    const submission = parameters.submission;
    return this.userService.readUser().then(profileData => {
      return this.workorderSummary(workorderId).then(summary => {
        const workorder = summary.workorder;
        const workflow = summary.workflow;
        const workorderResult = summary.result;

        if (!workorderResult) {
          // No result exists, The workflow should have been started
          return Promise.reject(new Error('No result exists for workorder ' + workorderId +
            '. The workflow done topic can only be used for a workflow that has begun'));
        }

        const step = _.find(workflow.steps, s => s.code === stepCode);

        // If there is no step, then this step submission is invalid.
        if (!step) {
          // No result exists, The workflow should have been started
          return Promise.reject(new Error('Invalid step to assign completed data for workorder ' + workorderId +
            ' and step code ' + stepCode));
        }

        // Got the workflow, now we can create the step result.
        const stepResult = {
          step,
          submission,
          status: STATUS.COMPLETE,
          timestamp: new Date().getTime(),
          submitter: profileData.id
        };

        // The result needs to be updated with the latest step results
        workorderResult.stepResults = workorderResult.stepResults || {};
        workorderResult.stepResults[step.code] = stepResult;
        workorderResult.status = this.checkStatus(workorder, workflow, workorderResult);
        workorderResult.nextStepIndex = this.executeStepReview(workflow.steps, workorderResult).nextStepIndex;

        return this.resultService.update(workorderResult).then(function() {
          return {
            workorder,
            workflow,
            result: workorderResult,
            nextStepIndex: workorderResult.nextStepIndex,
            step: workorderResult.nextStepIndex > -1 ? workflow.steps[workorderResult.nextStepIndex] : workflow.steps[0]
          };
        });
      });
    });
  }

  protected createNewResult(workorderId, assignee) {
    return this.resultService.create({
      id: shortid.generate(),
      status: STATUS.NEW_DISPLAY,
      nextStepIndex: 0,
      workorderId,
      assignee,
      stepResults: {}
    });
  }

  /**
   * Checks each of the result steps to determine if the workflow is complete,
   * and if not, what is the next step in the workflow to display to the user.
   */
  protected executeStepReview(steps: Step[], result: WorkOrderResult) {
    // tslint:disable-next-line:max-line-length
    // See https://github.com/feedhenry-raincatcher/raincatcher-workflow/blob/b515e8acefad4bc50a7cc281863e2176c8babbed/lib/client/workflow-client/workflowClient.js
    let nextStepIndex = 0;
    let complete = false;

    // If there is no result, then the first step is the next step.
    if (result && !_.isEmpty(result.stepResults)) {
      nextStepIndex = _.findIndex(steps, function(step) {
        // The next incomplete step is the step with no entry or it's not complete yet.
        return !result.stepResults || !result.stepResults[step.code] ||
          result.stepResults[step.code].status !== STATUS.COMPLETE;
      });

      if (nextStepIndex === -1) {
        complete = true;
        nextStepIndex = steps.length;
      }
    }
    return {
      nextStepIndex,
      complete // false means some steps are "pending"
    };
  }

  /**
   * Checking the status of a workorder
   *
   * @param workorder  - The workorder to check status
   * @param workflow   - The workflow to check status
   * @param result     - The result to check status
   */
  protected checkStatus(workorder: WorkOrder, workflow: WorkFlow, result: WorkOrderResult): STATUS {
    let status;
    const stepReview = this.executeStepReview(workflow.steps, result);
    if (stepReview.nextStepIndex >= workflow.steps.length - 1 && stepReview.complete) {
      status = STATUS.COMPLETE_DISPLAY;
    } else if (!workorder.assignee) {
      status = STATUS.UNASSIGNED_DISPLAY;
    } else if (stepReview.nextStepIndex < 0) {
      status = STATUS.NEW_DISPLAY;
    } else {
      status = STATUS.PENDING_DISPLAY;
    }
    return status;
  }
}
