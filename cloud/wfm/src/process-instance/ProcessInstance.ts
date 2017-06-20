import * as Promise from 'bluebird';
import {EventEmitter} from 'eventemitter3';
import * as _ from 'lodash';
import Process from '../process/Process';
import Task from '../task/Task';

export interface InstanceTaskEventData<T extends ProcessInstance>  {
  instance: T;
  task: Task;
}

export interface InstanceEventData<T extends ProcessInstance> {
  instance: T;
}

/**
 * The executable instance of a {@link Process}
 */
interface ProcessInstance extends EventEmitter {
  assigneeId: string;

  getTasks(): Promise<Task[]>;
  getCurrentTask(): Promise<Task>;
  /**
   * @return A promise that resolves to the next task in it's list,
   * so implementation be async
   */
  nextTask(): Promise<Task>;

  getId(): string;

  /**
   * Event emitted when the current active task changes to the next one
   */
  on(event: 'taskChange', handler: (e: InstanceTaskEventData<this>) => any): this;
  /**
   * Event emitted when all {@link Task}s achieve the done state
   */
  on(event: 'done', handler: (e: InstanceEventData<this>) => any): this;
}

export default ProcessInstance;
