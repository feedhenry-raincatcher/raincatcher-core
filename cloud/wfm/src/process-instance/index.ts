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

export interface ProcessInstance extends EventEmitter {
  assigneeId: string;
  // If we take a snapshot of the Workflow's Steps we might not need a reference to it
  // maybe just for keeping a historical/UI link
  // workflowId: string;

  tasks: Task[];
  currentTask: Task;
  // Optionally async
  next(): Task | Promise<Task>;

  getId(): string;

  on(event: 'task:change', handler: (e: InstanceStepEventData<this>) => any): this;
  on(event: 'process:done', handler: (e: InstanceEventData<this>) => any): this;
}

// Task is a class I don't see much need for custom implementations
class InstanceImpl extends EventEmitter implements ProcessInstance {
  public id: string;
  public assigneeId: string;
  public processId: string;
  public currentTask: Task;
  public tasks: Task[];

  protected currentStepIdx: number;

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
    return this.currentTask;
  }
}

export default InstanceImpl;
