import * as _ from 'lodash';
import Instance, { ProcessInstance } from '../process-instance';
import TaskImpl, { Task } from '../task';
/**
 * Definition holder for a set of Tasks
 * Supposed to be instantiated as a ProcessInstance to be executed
 */
export interface Process {
  id: string;
  /** Description for UI */
  displayName: string;
  tasks: Task[];

  toInstance(): ProcessInstance;
}

export default class ProcessImpl implements Process {
  public tasks: Task[];
  public id: string;
  constructor(public displayName: string) {
  }

  public toInstance() {
    const instance = new Instance(this.tasks);
    return instance;
  }
}
