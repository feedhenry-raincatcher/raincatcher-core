import * as Promise from 'bluebird';
import {EventEmitter} from 'eventemitter3';
import {cloneDeep} from 'lodash';
import {Task} from '../task';
import {InstanceTaskEventData, ProcessInstance} from './index';

export default class InstanceImpl extends EventEmitter implements ProcessInstance {
  public id: string;
  public assigneeId: string;
  public processId: string;
  public currentTask: Task;
  public tasks: Task[];

  protected currentTaskIdx: number;

  // TODO: add repository for data storage
  constructor(initialTasks: Task[]) {
    super();
    this.tasks = cloneDeep(initialTasks);
    this.currentTask = this.tasks[0];
    this.currentTaskIdx = 0;
  }

  public getId() {
    return this.id;
  }

  public next() {
    this.currentTask = this.tasks[++this.currentTaskIdx];
    const e: InstanceTaskEventData<this> = {
      instance: this,
      task: this.currentTask
    };
    this.emit('task:statusChange', e);
    return Promise.resolve(this.currentTask);
  }

  public getCurrentTask() {
    return Promise.resolve(this.currentTask);
  }

  public getTasks() {
    return Promise.resolve(this.tasks);
  }
}
