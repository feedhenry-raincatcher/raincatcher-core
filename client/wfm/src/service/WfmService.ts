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
      const { workorder, workflow } = summary;
      if (!workorder.assignee) {
        return Promise.reject(new Error(`Workorder with Id ${workorderId} has no assignee`));
      }
      workorder.status = STATUS.NEW_DISPLAY;
      workorder.result = {
        id: shortid.generate(),
        stepResults: {}
      };

      return Promise.all([
        this.workorderService.update(workorder)
      ]).then(([updatedWorkorder]) => {
        // Now we check the current status of the workflow to see where the next step should be.
        // We now have the current status of the workflow for this workorder, the begin step is now complete.
        let step;
        if (updatedWorkorder.currentStep) {
          step = workflow.steps[updatedWorkorder.currentStep];
        } else {
          step = workflow.steps[0];
        }

        return {
          updatedWorkorder,
          workflow,
          result: updatedWorkorder.result,
          // TODO get current step updatedWorkorder.currentStep
          // TODO use code here
          step
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
        const summary: Summary = {
          workflow,
          workorder,
          result,
          // TODO push next step method
          step: workflow.steps[0]
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

      if (!result) {
        // No result exists, The workflow should have been started
        return Promise.reject(new Error('No result exists for workflow ' + workorderId +
          '. The workflow back topic can only be used for a workflow that has begun'));
      }

      return self.workorderService.update(workorder)
        .then(() => ({
          workorder,
          workflow,
          result,
          // TODO push next step method
          step: workflow.steps[0]
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
      const { workorder, workflow, result } = summary;

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
        timestamp: new Date().getTime(),
        submitter: userId
      };

      // The result needs to be updated with the latest step results
      result.stepResults = result.stepResults || {};
      result.stepResults[step.code] = stepResult;
      workorder.status = STATUS.COMPLETE;

      return Promise.all([
        this.workorderService.update(workorder)
      ]).then(() => ({
        workorder,
        workflow,
        result,
        // TODO push next step method
        step: workflow.steps[0]
      }));
    });
  }

  /**
   * Checks each of the result steps to determine if the workflow is complete,
   * and if not, what is the next step in the workflow to display to the user.
   */
  // protected executeStepReview(steps: Step[], result?: WorkOrderResult) {
  //   let nextStepIndex = 0;
  //   let complete = false;

  //   // If there is no result, then the first step is the next step.
  //   if (result && !_.isEmpty(result.stepResults)) {
  //     nextStepIndex = _.findIndex(steps, function(step) {
  //       // The next incomplete step is the step with no entry or it's not complete yet.
  //       return !result.stepResults || !result.stepResults[step.code] ||
  //         result.stepResults[step.code].status !== STATUS.COMPLETE;
  //     });

  //     if (nextStepIndex === -1) {
  //       complete = true;
  //       nextStepIndex = steps.length;
  //     }
  //   }
  //   return {
  //     nextStepIndex,
  //     complete // false means some steps are "pending"
  //   };
  // }

  protected getNextStep(index: number, workflow: WorkFlow): Step {
    return index > -1 ? workflow.steps[index] : workflow.steps[0];
  }
}
