import * as Promise from 'bluebird';
export interface DataService<T> {
  list(): Promise<T[]>;
  read(id): Promise<T>;
  create(item: T): Promise<T>;
  update(item: T): Promise<T>;
  remove(item: T): Promise<T>;
}
