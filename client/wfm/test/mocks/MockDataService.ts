import * as Promise from 'bluebird';
import { find, cloneDeep } from 'lodash';
import { DataService } from '../../src/index';
export class MockDataService<T extends { id: string }> implements DataService<T> {
  protected data: T[] = [];
  constructor(protected fixtures: T[] = []) {
    this.data = cloneDeep(fixtures);
  }
  public read(id) {
    return Promise.resolve(find(this.data, item => item.id === id));
  }
  public list() {
    return Promise.resolve(this.data);
  }
  public create(data: T) {
    return Promise.resolve(data);
  }
  public update(data) {
    return Promise.resolve(data);
  }
  public remove(data) {
    return Promise.resolve(data);
  }
  public reset() {
    this.data = cloneDeep(this.fixtures);
  }
}
