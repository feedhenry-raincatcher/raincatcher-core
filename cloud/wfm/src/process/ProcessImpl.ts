import Instance from '../process-instance';
import TaskImpl, { Task } from '../task';
import {Process} from './index';

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
