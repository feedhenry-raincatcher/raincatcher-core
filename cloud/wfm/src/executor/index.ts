import * as Promise from 'bluebird';
import { Process } from '../process';
import { InstanceEventData, ProcessInstance } from '../process-instance';
import { Task } from '../task';
export interface Executor {
  process: Process;
  instance?: ProcessInstance;
  start(): void;
}

export interface InstanceRepository {
  save(instance: ProcessInstance): Promise<ProcessInstance>;
}

class ExecutorImpl implements Executor {
  public instance: ProcessInstance;
  constructor(public process: Process, public taskRepository: InstanceRepository) {
  }
  public start() {
    this.instance = this.process.toInstance();
    this.instance.currentTask.run();
    this.instance.on('task:change', this.stepChanged);
  }
  public stepChanged(e: InstanceEventData<ProcessInstance>) {
    Promise.resolve(this.instance.next())
      .then(this.saveTask)
      .then(() => this.instance.currentTask.run());
  }
  protected saveTask() {
    return this.taskRepository.save(this.instance);
  }
}

export default ExecutorImpl;
