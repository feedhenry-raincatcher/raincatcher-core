import * as Promise from 'bluebird';
import { cloneDeep, find, findIndex, remove } from 'lodash';
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
  public create(item: T) {
    this.data.push(item);
    return Promise.resolve(item);
  }
  public update(item) {
    const idx = findIndex(this.data, i => i.id === item.id);
    if (idx > -1) {
      this.data[idx] = item;
    }
    return Promise.resolve(item);
  }
  public remove(item) {
    this.data = remove(this.data, i => i.id === item.id);
    return Promise.resolve(item);
  }
  public reset() {
    this.data = cloneDeep(this.fixtures);
  }
}
