import * as Promise from 'bluebird';
export interface DataService<T> {
  list(): Promise<T[]>;
  read(id): Promise<T>;
  create(T): Promise<T>;
  update(T): Promise<T>;
  remove(T): Promise<T>;
}
