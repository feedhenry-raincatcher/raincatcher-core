import {ProcessInstance, ProcessInstanceRepository, ProcessRepository} from '@raincatcher/wfm';
import * as Promise from 'bluebird';
import {cloneDeep, filter, find} from 'lodash';

export class InMemoryProcessInstanceRepository implements ProcessInstanceRepository {
  private data: ProcessInstance[];
  constructor(protected seedData: ProcessInstance[]) {
    this.reset();
  }
  public reset() {
    this.data = cloneDeep(this.seedData);
  }
  public getAll() {
    return Promise.resolve(this.data);
  }

  public getById(id: string) {
    return Promise.resolve(find(this.data, i => i.id === id));
  }

  public getByProcessId(id: string) {
    return Promise.resolve(filter(this.data, i => i.processId === id));
  }

  public create(process: ProcessInstance) {
    this.data.push(process);
    return Promise.resolve(process);
  }

  public getUnassigned() {
    return Promise.resolve(filter(this.data, i => !i.assigneeId));
  }
}
