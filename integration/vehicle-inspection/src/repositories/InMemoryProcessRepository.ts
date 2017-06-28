import {Process, ProcessRepository, TaskRepository} from '@raincatcher/wfm';
import * as Promise from 'bluebird';
import {cloneDeep} from 'lodash';

class InMemoryProcessRepository implements ProcessRepository {
  private data: Process[] = [];
  constructor(protected seedData: Process[], protected taskRepository: TaskRepository) {
    this.data = cloneDeep(seedData);
  }
  public getAll() {
    return Promise.resolve(this.data);
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
