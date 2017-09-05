import * as Promise from 'bluebird';
import * as _ from 'lodash';
import * as shortid from 'shortid';
import { Step } from '../model/Step';
import { StepResult } from '../model/StepResult';
import { WorkFlow } from '../model/WorkFlow';
import { WorkOrder } from '../model/WorkOrder';
import { STATUS } from '../status';
import { DataService } from './DataService';
import { UserService } from './UserService';

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
  public begin(workorderId: string): Promise<WorkOrder> {
    return this.readWorkOrder(workorderId).then(workorder => {
      if (this.hasBegun(workorder)) {
        // tslint:disable-next-line:max-line-length
        throw new Error(`beginWorkflow() called on workflow with id: ${workorderId} and status ${workorder.status}`);
      }
      if (_.isEmpty(workorder.workflow.steps)) {
        throw new Error(`WorkOrder with id: ${workorderId} references an empty WorkFlow and cannot be started`);
      }
      if (!workorder.assignee) {
        throw new Error(`Workorder with Id ${workorderId} has no assignee and cannot be started`);
      }
      workorder.status = STATUS.PENDING;
      workorder.currentStep = workorder.workflow.steps[0].id;
      workorder.result = [];

      return this.workorderService.update(workorder);
    });
  }

  /**
   * Going to the previous step of a workorder.
   *
   * @param workorderId - The ID of the workorder to switch to the previous step for
   */
  public previousStep(workorderId: string): Promise<WorkOrder> {
    const self = this;
    return this.readWorkOrder(workorderId).then(workorder => {
      if (!this.hasBegun(workorder)) {
        // tslint:disable-next-line:max-line-length
        throw new Error(`Can only go to the previous step of a workorder that has begun. WorkOrder ${workorder.id} has status ${workorder.status}`);
      }

      workorder.result.pop();
      const index = this.getCurrentStepIdx(workorder);
      if (!index) {
        workorder.currentStep = undefined;
      } else {
        const previousStep = workorder.workflow.steps[index - 1];
        // Previous step might be undefined if index-1 < 0
        workorder.currentStep = previousStep && previousStep.id;
      }

      return self.workorderService.update(workorder);
    });
  }

  public getCurrentStep(workorder: WorkOrder): Step | undefined {
    if (!workorder.currentStep) {
      return;
    }
    return _.find(workorder.workflow.steps,
      step => step.id === workorder.currentStep);
  }

  /**
   * Completes the current step of a workorder.
   * @param workorderId Id of the workorder
   * @param submission Data for the step's result
   * @param nextId Optional id of the next step to move to
   */
  public completeStep(workorderId: string, submission: object, nextId?: string): Promise<WorkOrder> {
    return Promise.all([
      this.userService.readUser().then(profileData => profileData.id),
      this.readWorkOrder(workorderId)
    ]).then(([userId, workorder]) => {
      if (!this.hasBegun(workorder)) {
        // tslint:disable-next-line:max-line-length
        throw new Error(`Can only go to the previous step of a workorder that has begun. WorkOrder ${workorder.id} has status ${workorder.status}`);
      }
      const stepId = workorder.currentStep;
      if (!stepId) {
        return Promise.reject(new Error('Invalid step to assign completed data for workorder ' + workorderId));
      }
      const stepResult: StepResult = {
        stepId,
        submission,
        timestamp: new Date().getTime(),
        submitter: userId
      };

      workorder.result.push(stepResult);
      this.goToNextStep(workorder, nextId);

      return this.workorderService.update(workorder);
    });
  }

  /**
   * Helper method that throws on a not-found workorder
   * @param workorderId Id of the workorder
   */
  protected readWorkOrder(workorderId: string): Promise<WorkOrder> {
    return this.workorderService.read(workorderId).then(workorder => {
      if (!workorder) {
        throw new Error(`WorkOrder with id ${workorderId} not found`);
      }
      return workorder;
    });
  }

  protected getCurrentStepIdx(workorder: WorkOrder) {
    if (!workorder.currentStep) {
      return;
    }
    return _.findIndex(workorder.workflow.steps,
      step => step.id === workorder.currentStep);
  }

  protected hasBegun(workorder: WorkOrder): boolean {
    return workorder.status !== STATUS.NEW &&
      workorder.status !== STATUS.UNASSIGNED;
  }

  protected goToNextStep(workorder: WorkOrder, nextId?: string) {
    if (nextId) {
      const step = _.find(workorder.workflow.steps,
        s => s.id === nextId);
      if (!step) {
        throw new Error(`${nextId} not found in the steps for WorkOrder ${workorder.id}`);
      }
      return workorder.currentStep = step.id;
    }

    const index = this.getCurrentStepIdx(workorder) || -1;
    // if current is the last, workorder is now complete
    if (index === workorder.workflow.steps.length - 1) {
      workorder.status = STATUS.COMPLETE;
      return workorder.currentStep = undefined;
    }
    const nextStep = workorder.workflow.steps[index + 1];
    return workorder.currentStep = nextStep && nextStep.id;
  }
}
