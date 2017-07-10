import * as Promise from 'bluebird';
import JsonSchema from './JsonSchema';

type ID = string | number;

export interface Store<T> {
  schema: JsonSchema;

  query(): ExecutableChainQuery<T>;
  or(): ChainQuery<T>;
  create(data: T): Promise<T>;
  update(id: ID, data: T): Promise<T>;
  delete(id: ID): Promise<T>;
  reset(): Promise<T[]>;
}

interface ChainQuery<T> {
  // For any supplied key of T,
  // take a value with the same type as the corresponding property of T
  where<K extends keyof T>(key: K, value: T[K]): this;
  gt<K extends keyof T>(key: K, value: T[K]): this;
  gte<K extends keyof T>(key: K, value: T[K]): this;
  lt<K extends keyof T>(key: K, value: T[K]): this;
  lte<K extends keyof T>(key: K, value: T[K]): this;
  ne<K extends keyof T>(key: K, value: T[K]): this;
  matches<K extends keyof T>(key: K, value: RegExp): this;
  or(other: ChainQuery<T>): this;

  limit(max: number): this;
  skip(amount: number): this;

  sort<K extends keyof T>(key: K, value: 'asc' | 'desc'): this;
  sortBy<K extends keyof T>(key: K, by: (value: T[K]) => number): this;
}

interface ExecutableChainQuery<T> extends ChainQuery<T> {
  get(): Promise<T[]>;
  getSingle(): Promise<T>;
}

import MongoStore from './MongoStore';
export default MongoStore;
