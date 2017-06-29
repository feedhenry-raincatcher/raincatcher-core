import {Process, ProcessRepository, TaskRepository} from '@raincatcher/wfm';
import * as Promise from 'bluebird';
import {cloneDeep, find} from 'lodash';

export class InMemoryProcessRepository implements ProcessRepository {
  private data: Process[] = [];
  constructor(protected seedData: Process[] = [], protected taskRepository: TaskRepository) {
    this.data = cloneDeep(seedData);
  }
  public getAll() {
    return Promise.resolve(this.data);
  }

  public getById(id: string) {
    return Promise.resolve(find(this.data, p => p.id === id));
  }

  public create(process: Process) {
    return this.taskRepository.createBatch(process.tasks)
    .then(tasks => {
      process.tasks = tasks;
      this.data.push(process);
      return process;
    });
  }
}
