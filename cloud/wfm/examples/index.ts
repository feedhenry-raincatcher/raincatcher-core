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
  Task
} from '../src';

// Create set of tasks you want to store
class MyTask extends BaseTask {
  public run() {
    // tslint:disable-next-line:no-console
    console.log('Executed task');
    BaseTask.prototype.run.call(this);
  }
}

// Create a sample
const exampleProcess: Process = new ProcessImpl('Example', [new MyTask()]);

// Store process instances.
const repository: ExecutorRepository = {
  saveInstance(instance: ProcessInstance) {
    // Save data here
    return Promise.resolve(instance);
  }
};

const executor: Executor = new ExecutorImpl(exampleProcess, repository);
executor.start();
