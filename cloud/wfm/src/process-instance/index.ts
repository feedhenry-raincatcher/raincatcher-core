import * as Promise from 'bluebird';
import { EventEmitter } from 'eventemitter3';
import * as _ from 'lodash';
import { Process } from '../process';
import { Task } from '../task';

export interface InstanceStepEventData<T extends ProcessInstance>  {
  instance: T;
  task: Task;
}

export interface InstanceEventData<T extends ProcessInstance> {
  instance: T;
}

/**
 * The executable instance of a Process
 */
export interface ProcessInstance extends EventEmitter {
  assigneeId: string;

  getTasks(): Promise<Task[]>;
  getCurrentTask(): Promise<Task>;
  /**
   * @return A promise that resolves to the next task in it's list, can be async
   */
  next(): Promise<Task>;

  getId(): string;

  /**
   * Event emitted when
   */
  on(event: 'task:change', handler: (e: InstanceStepEventData<this>) => any): this;
  on(event: 'process:done', handler: (e: InstanceEventData<this>) => any): this;
}

class InstanceImpl extends EventEmitter implements ProcessInstance {
  public id: string;
  public assigneeId: string;
  public processId: string;
  public currentTask: Task;
  public tasks: Task[];

  protected currentStepIdx: number;

  // TODO: add repository for data storage
  constructor(initialSteps: Task[]) {
    super();
    this.tasks = _.cloneDeep(initialSteps);
    this.currentTask = this.tasks[0];
    this.currentStepIdx = 0;
  }

  public getId() {
    return this.id;
  }

  public next() {
    this.currentTask = this.tasks[++this.currentStepIdx];
    const e: InstanceStepEventData<this> = {
      instance: this,
      task: this.currentTask
    };
    this.emit('step:change', e);
    return Promise.resolve(this.currentTask);
  }

  public getCurrentTask() {
    return Promise.resolve(this.currentTask);
  }

  public getTasks() {
    return Promise.resolve(this.tasks);
  }
}

export default InstanceImpl;
