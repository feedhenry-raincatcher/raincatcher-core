import {Task, TaskRepository} from '@raincatcher/wfm';
import * as Promise from 'bluebird';
import {cloneDeep} from 'lodash';

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

  public createBatch(tasks: Task[]) {
    this.data = this.data.concat(tasks);
    return Promise.resolve(this.data);
  }
}
