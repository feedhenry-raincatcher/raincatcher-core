import * as Promise from 'bluebird';
import { Db } from 'mongodb';
import { ApiError } from '../data-api/ApiError';
import { CrudRepository } from '../data-api/CrudRepository';
import { PageRequest } from '../data-api/PageRequest';
import { PageResponse } from '../data-api/PageResponse';
import * as errorCodes from './ErrorCodes';

const dbError: ApiError = { code: errorCodes.DB_ERROR, message: 'MongoDbRepository database not intialized' };

/**
 * Service for performing data operations on mongodb database
 */
export class MongoDbRepository implements CrudRepository {

  public db: any;

  /**
   * @param collectionName - name of the collection stored in mongodb
   */
  constructor(readonly collectionName: string) {
    const self = this;
  }

  public list(filter: any, request: PageRequest): Promise<PageResponse> {
    if (!this.db) {
      return Promise.reject(dbError);
    }
    return this.db.collection(this.collectionName).find(filter);
  }

  public get(id: string) {
    if (!this.db) {
      return Promise.reject(dbError);
    }
    return this.db.collection(this.collectionName).findOne({ id });
  }

  public create(object: any) {
    if (!this.db) {
      return Promise.reject(dbError);
    }
    return this.db.collection(this.collectionName).insertOne(object);
  }

  public update(object: any) {
    if (!this.db) {
      return Promise.reject(dbError);
    }
    const id = object.id;
    return this.db.collection(this.collectionName).updateOne({ id }, object);
  }

  public delete(id: string) {
    if (!this.db) {
      return Promise.reject(dbError);
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
