import * as _ from 'lodash';
import Instance, { ProcessInstance } from '../process-instance';
import TaskImpl, { Task } from '../task';
/**
 * Definition holder for a set of Tasks
 * Intended to be instantiated as a ProcessInstance  in order to be executed
 */
export interface Process {
  /** Unique identifier for this Process */
  id: string;
  /** Description for UI */
  displayName: string;
  tasks: Task[];

  createInstance(): ProcessInstance;
}

export default class ProcessImpl implements Process {
  public tasks: Task[];
  public id: string;
  constructor(public displayName: string) {
  }

  public createInstance() {
    const instance = new Instance(this.tasks);
    return instance;
  }
}
