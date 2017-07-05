import * as Promise from 'bluebird';
import {ProcessInstance} from '../process-instance/ProcessInstance';
import {Process} from '../process/Process';
import {Task, TaskEventData, TaskStatus} from '../task/Task';
import {Executor} from './Executor';
import {ExecutorRepository} from './ExecutorRepository';

/**
 * Default implementation for {@link Executor}
 */
export class ExecutorImpl implements Executor {
  public instance: ProcessInstance;
  /**
   * @param process The {@link Process} this {@link Executor} is to run
   * @param repository {@link ExecutorRepository} instance for data access
   */
  constructor(public process: Process, public repository: ExecutorRepository) {
    this.instance = this.process.createInstance();
  }
  public start() {
    this.runCurrentTask();
  }
  protected onTaskDone(e: TaskEventData<Task>) {
    if (e.currentStatus === TaskStatus.DONE) {
      Promise.resolve(this.instance.nextTask())
        .then(() => this.saveInstance())
        .then(() => this.runCurrentTask());
    }
  }

  /**
   * Orders {@link repository} to update {@link instance}
   */
  protected saveInstance() {
    return this.repository.saveInstance(this.instance);
  }

  /**
   * Runs the present {@link Task} of {@link instance} and sets up execution of
   * the next one as it is run
   */
  protected runCurrentTask() {
    this.instance.getCurrentTask()
    .then(task => {
      // currentTask is undefined after all are done
      if (!task) {
        return;
      }
      return task
        .on('statusChange', this.onTaskDone.bind(this))
        .run();
    });
  }

  protected movePrevious() {

  }
}
