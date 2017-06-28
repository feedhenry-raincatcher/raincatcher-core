import {Task, TaskRepository} from '@raincatcher/wfm';
import * as Promise from 'bluebird';

class InMemoryTaskRepository implements TaskRepository {
  private data: Task[] = [];
  public createBatch(tasks: Task[]) {
    this.data = this.data.concat(tasks);
    return Promise.resolve(this.data);
  }
}
