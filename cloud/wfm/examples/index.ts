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

// Derive from BaseTask to implement one that deals with custom business logic
class MyTask extends BaseTask {
  public run() {
    this.status = TaskStatus.ASSIGNED;
    // Here the implementation would wait for user input or execute automatically
    // moving the status as progress occurs

    // BaseTask's implementation takes care of publishing the 'statusChanged' event
    this.status = TaskStatus.DONE;
  }
}

// Each Process contains a set of Tasks to be executed.
const exampleProcess: Process = new ProcessImpl('Example', [
  new MyTask()
]);

// Provide an implementation of the Repository required by the Process in order to have persistent storage
const repository: ExecutorRepository = {
  saveInstance(instance: ProcessInstance) {
    // Save data to persistent storage here
    return Promise.resolve(instance);
  }

};
// Finally the executor creates a ProcessInstance from the supplied Process, allowing it to be exectuted
const executor: Executor = new ExecutorImpl(exampleProcess, repository);
executor.start();
