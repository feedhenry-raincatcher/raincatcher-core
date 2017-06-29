import {Task, TaskRepository} from '@raincatcher/wfm';
import * as Promise from 'bluebird';
import {cloneDeep, filter} from 'lodash';

export class InMemoryTaskRepository implements TaskRepository {
  private data: Task[] = [];
  constructor(protected seedData: Task[] = []) {
    this.reset();
  }
  public reset() {
    this.data = cloneDeep(this.seedData);
  }

  public getAll() {
    return Promise.resolve(this.data);
  }

  public createMany(tasks: Task[]) {
    this.data = this.data.concat(tasks);
    return Promise.resolve(this.data);
  }
}
