import * as Promise from 'bluebird';
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
} from '../src';

// Create set of tasks you want to store
class MyTask extends BaseTask {
  public run() {
    this.status = TaskStatus.ASSIGNED;
    // Here the implementation would wait for user input,
    // moving the status as progress occurs

    // BaseTask's implementation takes care of publishing the 'statusChanged' event
    this.status = TaskStatus.DONE;
  }
}

// Create a sample
const exampleProcess: Process = new ProcessImpl('Example', [new MyTask()]);

// Store process instances.
const repository: ExecutorRepository = {
  saveInstance(instance: ProcessInstance) {
    // Save data to persistent storage here
    return Promise.resolve(instance);
  }
};

const executor: Executor = new ExecutorImpl(exampleProcess, repository);
executor.start();
