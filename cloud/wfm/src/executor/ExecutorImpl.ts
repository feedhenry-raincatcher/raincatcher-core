import * as Promise from 'bluebird';
import ProcessInstance from '../process-instance/ProcessInstance';
import Process from '../process/Process';
import Task, {TaskEventData, TaskStatus} from '../task/Task';
import Executor from './Executor';
import InstanceRepository from './InstanceRepository';

export default class ExecutorImpl implements Executor {
  public instance: ProcessInstance;
  constructor(public process: Process, public instanceRepository: InstanceRepository) {
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
  protected saveInstance() {
    return this.instanceRepository.save(this.instance);
  }
  protected runCurrentTask() {
    this.instance.getCurrentTask()
    .then(t => {
      // currentTask is undefined after all are done
      if (!t) {
        return;
      }
      return t.on('statusChange', this.onTaskDone.bind(this)).run();
    });
  }
}
