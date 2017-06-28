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
import {VehicleInspectionTask} from './vehicle-inspection/VehicleInspectionTask';

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
