import {ProcessInstance, ProcessInstanceRepository} from '@raincatcher/wfm';
import * as Promise from 'bluebird';
import {cloneDeep, filter} from 'lodash';

export class InMemoryProcessInstanceRepository implements ProcessInstanceRepository {
  private data: ProcessInstance[];
  constructor(protected seedData: ProcessInstance[]) {
    this.data = cloneDeep(seedData);
  }
  public getAll() {
    return Promise.resolve(this.data);
  }

  public create(process: ProcessInstance) {
    this.data.push(process);
    return Promise.resolve(process);
  }

  public getUnassigned() {
    return Promise.resolve(filter(this.data, p => !p.assigneeId));
  }
}
