import Instance from '../process-instance';
import TaskImpl, { Task } from '../task';
import {Process} from './index';

export default class ProcessImpl implements Process {
  public tasks: Task[];
  public id: string;
  constructor(public displayName: string) {
  }

  public createInstance() {
    if (!this.tasks || this.tasks.length === 0) {
      throw new Error('Task list must be set before calling createInstance()');
    }
    const instance = new Instance(this.tasks);
    return instance;
  }
}
