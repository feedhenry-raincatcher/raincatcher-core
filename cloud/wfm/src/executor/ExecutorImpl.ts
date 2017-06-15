import * as Promise from 'bluebird';
import {Process} from '../process';
import {ProcessInstance} from '../process-instance';
import {Task, TaskEventData, TaskStatus} from '../task';
import {Executor} from './index';

export interface InstanceRepository {
  save(instance: ProcessInstance): Promise<ProcessInstance>;
}

export default class ExecutorImpl implements Executor {
  public instance: ProcessInstance;
  constructor(public process: Process, public instanceRepository: InstanceRepository) {
    this.instance = this.process.createInstance();
  }
  public start() {
    this.runCurrentTask();
  }
  protected onTaskDone(e: TaskEventData<Task>) {
    if (e.currentStatus === TaskStatus.done) {
      Promise.resolve(this.instance.next())
        .then(() => this.saveInstance)
        .then(() => this.runCurrentTask());
    }
  }
  protected saveInstance() {
    return this.instanceRepository.save(this.instance);
  }
  protected runCurrentTask() {
    this.instance.getCurrentTask()
      .then(t => t.on('statusChange', this.onTaskDone).run());
  }
}