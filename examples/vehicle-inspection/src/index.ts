import {
  BaseTask,
  Executor,
  ExecutorImpl,
  ExecutorRepository,
  Process,
  ProcessImpl,
  ProcessInstance,
  ProcessInstanceImpl,
  Result,
  Task,
  TaskStatus
} from '@raincatcher/wfm';
import * as Promise from 'bluebird';
import * as _ from 'lodash';

/**
 * Data for the form to be supplied from the ui as it is filled by the user
 * Partially based off the form in https://github.com/feedhenry-raincatcher/raincatcher-vehicle-inspection/
 */
interface VehicleInspectionFormData {
  fuel: number;
  tires: boolean;
  lights: boolean;
  /**
   * Array of urls of uploaded pictures, intended to be used when 'requirePictures' was configured in the Task
   */
  pictures?: [string];
}

class VehicleInspectionFormResult implements Result {
  public type = 'VehicleInspectionFormResult';
  constructor(public data: VehicleInspectionFormData) {
  }
}

// Derive from BaseTask to implement one that deals with custom business logic
class VehicleInspectionTask extends BaseTask {
  public result: VehicleInspectionFormResult;
  constructor(public userId: string) {
    super();
  }
  public getOptionsSchema() {
    return {
      properties: {
        includeFullEngineReview: {
          type: 'boolean'
        },
        requirePictures: {
          type: 'boolean'
        }
      },
      required: ['includeFullEngineReview', 'requirePictures']
    };
  }
  public run() {
    this.status = TaskStatus.ASSIGNED;
  }

  public fillFormData(data: VehicleInspectionFormData) {
    if (this.getStatus() < TaskStatus.ASSIGNED && !this.userId) {
      throw new Error('This Task must be assigned to a user before its form is filled');
    }

    if (this.options.requirePictures) {
      if (_.isEmpty(data.pictures)) {
        throw new Error('Picture data for the Vehicle Inspection is required');
      }
    }
    this.result = new VehicleInspectionFormResult(data);
    this.status = TaskStatus.DONE;
  }
}

const inspectionProcess: Process = new ProcessImpl('Example', [
  new VehicleInspectionTask('vehicle-inspector-id')
]);

// TODO: use mongo here
class InMemoryExecutorRepository implements ExecutorRepository {
  private instance: ProcessInstance;
  public saveInstance(instance: ProcessInstance) {
    this.instance = instance;
    return Promise.resolve(this.instance);
  }
}

const repository = new InMemoryExecutorRepository();

const executor: Executor = new ExecutorImpl(inspectionProcess, repository);
executor.start();
