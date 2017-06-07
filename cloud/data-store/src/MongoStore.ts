import * as mongodb from 'mongodb';

export default class MongoStore<T> implements Store<T> {
  constructor(protected db: mongodb.Db) {
  }
}
