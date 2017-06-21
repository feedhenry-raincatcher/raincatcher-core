import * as Promise from 'bluebird';
import {
  BaseTask,
  Executor,
  ExecutorImpl,
  ExecutorRepository,
  Process,
  ProcessImpl,
  ProcessInstance
} from '../src/index';

// Create set of tasks you want to store
class MyTask extends BaseTask {
  public name: string;

  constructor(name: string) {
    super();
    this.name = name;
  }

  public run() {
    // tslint:disable-next-line:no-console
    console.log('Executed task: ' + this.name);
  }
}

// Create example process
const exampleProcess: Process = new ProcessImpl('Example');
exampleProcess.tasks = [new MyTask('StartProcessing'), new MyTask('CheckInventory')];

// Store process instances.
const repository: ExecutorRepository = {
  saveInstance(instance: ProcessInstance): Promise<ProcessInstance> {
    // Save data here
    return Promise.resolve(instance);
  }
};

const executor: Executor = new ExecutorImpl(exampleProcess, repository);

// Actual processing
// tslint:disable-next-line:no-console
console.log('[Integration] Starting process');
// TODO explanation this looks like execution is async here.
executor.start();
//
