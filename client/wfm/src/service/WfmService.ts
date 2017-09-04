import * as Promise from 'bluebird';
import * as _ from 'lodash';
import * as shortid from 'shortid';
import { Step } from '../model/Step';
import { WorkFlow } from '../model/WorkFlow';
import { WorkOrder } from '../model/WorkOrder';
import { WorkOrderResult } from '../model/WorkOrderResult';
import { STATUS } from '../status';
import { DataService } from './DataService';
import { UserService } from './UserService';

// FIXME Remove this
/**
 * Parameter interface for the {@link WfmService#completeStep()} function
 */
export interface CompleteStepParams {
  /** The ID of the workorder to complete the step for */
  workorderId: string;
  /** The submission to save */
  submission: object;
  /** The ID of the step to save the submission for */
  stepCode: string;
}

// FIXME adjust UI to not relay on summary and pick all data from Workorder
/**
 * Return value of the {@link WfmService#workorderSummary} interface
 */
export interface Summary {
  workflow: WorkFlow;
  workorder: WorkOrder;
  result?: WorkOrderResult;
  /**
   * Index of the next {@link Step} the {@link WorkOrder} should progress to after completion of the current one.
   * This allows for skipping or returning to a previous {@link Step}.
   */
  nextStepIndex: number;
  step: Step;
}

export class WfmService {
  constructor(
    protected workorderService: DataService<WorkOrder>,
    protected userService: UserService
  ) {
  }

  /**
   * Beginning a workflow for a single Workorder.
   *
   * @param {string} workorderId - The ID of the workorder to begin the workflow for.
   */
  public beginWorkflow(workorderId: string): Promise<Summary> {
    return this.workorderSummary(workorderId).then(summary => {
      if (summary.result) {
        return Promise.reject(new Error(`beginWorkflow() called on already started workflow with id: ${workorderId}`));
      }
      const { workorder, workflow, nextStepIndex } = summary;
      if (!workorder.assignee) {
        return Promise.reject(new Error(`Workorder with Id ${workorderId} has no assignee`));
      }
      workorder.status = this.checkStatus(workorder, workflow);
      workorder.result = {
        id: shortid.generate(),
        // TODO move status
        status: STATUS.NEW_DISPLAY,
        stepResults: {}
      };

      return Promise.all([
        this.workorderService.update(workorder)
      ]).then(([updatedWorkorder]) => {
        // Now we check the current status of the workflow to see where the next step should be.
        // FIXME  remove this and provide status on workoder (needs UI change)
        updatedWorkorder.result.status = updatedWorkorder.status;

        // We now have the current status of the workflow for this workorder, the begin step is now complete.
        return {
          updatedWorkorder,
          workflow,
          result: updatedWorkorder.result,
          nextStepIndex,
          step: this.getNextStep(nextStepIndex, workflow)
        };
      });
    });
  }

  /**
   * FIXME - no longer needed. Just fetch workorder
   *
   * Gets a summary of the workflow.
   * This will get all of the details related to the workorder, including workflow and result data.
   *
   * @param {string} workorderId - The ID of the workorder to get the summary for.
   * @return {{workflow: Workflow, workorder: Workorder, result: Result}}
   * An object containing all the major entities related to the workorder
   */
  public workorderSummary(workorderId: string): Promise<Summary> {
    const workorderRead = this.workorderService.read(workorderId)
      .then(workorder => {
        if (!workorder) {
          throw new Error(`No workorder found with id ${workorderId}`);
        }
        return workorder;
      });
    return workorderRead
      .then(workorder => {
        const workflow: WorkFlow = workorder.workflow;
        const result: WorkOrderResult = workorder.result;
        const nextStepIndex = this.executeStepReview(workflow.steps, result).nextStepIndex;
        const summary: Summary = {
          workflow,
          workorder,
          result,
          nextStepIndex,
          step: this.getNextStep(nextStepIndex, workflow)
        };
        return summary;
      });
  }

  /**
   * Going to the previous step of a workorder.
   *
   * @param workorderId - The ID of the workorder to switch to the previous step for
   */
  public previousStep(workorderId: string): Promise<Summary> {
    const self = this;

    // TODO fetch workorder only
    return this.workorderSummary(workorderId).then(summary => {
      const { workorder, workflow, result } = summary;
      let { nextStepIndex } = summary;

      if (!result) {
        // No result exists, The workflow should have been started
        return Promise.reject(new Error('No result exists for workflow ' + workorderId +
          '. The workflow back topic can only be used for a workflow that has begun'));
      }

      // -1 is a special value for 'no next step'
      nextStepIndex = _.max([nextStepIndex - 1, -1]) || -1; // _.max returns `number?`

      return self.workorderService.update(workorder)
        .then(() => ({
          workorder,
          workflow,
          result,
          nextStepIndex,
          step: this.getNextStep(nextStepIndex, workflow)
        }));
    });
  }

  /**
   * Completing a single step for a workorder.
   */
  public completeStep(parameters: CompleteStepParams): Promise<Summary> {
    const workorderId = parameters.workorderId;
    const stepCode = parameters.stepCode;
    const submission = parameters.submission;
    return Promise.all([
      this.userService.readUser().then(profileData => profileData.id),
      this.workorderSummary(workorderId)
    ]).then(([userId, summary]) => {
      const { workorder, workflow, result, nextStepIndex } = summary;

      if (!result) {
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
        submitter: userId
      };

      // The result needs to be updated with the latest step results
      result.stepResults = result.stepResults || {};
      result.stepResults[step.code] = stepResult;
      const status = this.checkStatus(workorder, workflow, result);
      workorder.status = status;

      return Promise.all([
        this.workorderService.update(workorder)
      ]).then(() => ({
        workorder,
        workflow,
        result,
        nextStepIndex,
        step: this.getNextStep(nextStepIndex, workflow)
      }));
    });
  }

  /**
   * Checks each of the result steps to determine if the workflow is complete,
   * and if not, what is the next step in the workflow to display to the user.
   */
  protected executeStepReview(steps: Step[], result?: WorkOrderResult) {
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

  protected getNextStep(index: number, workflow: WorkFlow): Step {
    return index > -1 ? workflow.steps[index] : workflow.steps[0];
  }

  /**
   * Checking the status of a workorder
   *
   * @param workorder  - The workorder to check status
   * @param workflow   - The workflow to check status
   * @param result     - The result to check status
   */
  protected checkStatus(workorder: WorkOrder, workflow: WorkFlow, result?: WorkOrderResult): STATUS {
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
