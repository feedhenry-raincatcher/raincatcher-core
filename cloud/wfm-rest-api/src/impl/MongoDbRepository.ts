import * as Promise from 'bluebird';
import { Db } from 'mongodb';
import { CrudRepository } from '../data-api/CrudRepository';
import { PageRequest } from '../data-api/PageRequest';
import { PageResponse } from '../data-api/PageResponse';

/**
 * Service for performing data operations on mongodb database
 */
export class MongoDbRepository implements CrudRepository {

  private db: Db;

  /**
   * @param collectionName - name of the collection stored in mongodb
   */
  constructor(readonly collectionName: string) {
    const self = this;
  }

  public list(filter: any, request: PageRequest): Promise<PageResponse> {
    if (!this.db) {
      Promise.reject('Db not intialized');
    }
    return this.db.collection(this.collectionName).find(filter);
  }

  public get(id: string) {
    if (!this.db) {
      Promise.reject('Db not intialized');
    }
    return this.db.collection(this.collectionName).findOne({ id });
  }

  public create(object: any) {
    if (!this.db) {
      Promise.reject('Db not intialized');
    }
    return this.db.collection(this.collectionName).insertOne(object);
  }

  public update(object: any) {
    if (!this.db) {
      Promise.reject('Db not intialized');
    }
    const id = object.id;
    return this.db.collection(this.collectionName).updateOne({ id }, object);
  }

  public delete(id: string) {
    if (!this.db) {
      Promise.reject('Db not intialized');
    }
    return this.db.collection(this.collectionName).deleteOne({ id });
  }

  /**
   * Inject database connection
   */
  public setDb(db: Db) {
    this.db = db;
  }
}
