import * as Bluebird from 'bluebird';
import { Collection, Cursor, CursorCommentOptions, Db } from 'mongodb';
import { generate } from 'shortid';
import { ApiError } from '../data-api/ApiError';
import { defaultPaginationEngine } from '../data-api/MongoPaginationEngine';
import { DIRECTION, SortedPageRequest } from '../data-api/PageRequest';
import { PageResponse } from '../data-api/PageResponse';
import { PagingDataRepository } from '../data-api/PagingDataRepository';
import * as errorCodes from './ErrorCodes';

const dbError: ApiError = new ApiError(errorCodes.DB_ERROR, 'MongoDbRepository database not intialized');

/**
 * Service for performing data operations on mongodb database
 */
export class MongoDbRepository<T extends { id: string }> implements PagingDataRepository<T> {

  public db: Db;
  protected collection: Collection<T>;

  /**
   * @param collectionName - name of the collection stored in mongodb
   */
  constructor(readonly collectionName: string) {
  }

  public list(filter: object | CursorCommentOptions, request: SortedPageRequest): Bluebird<PageResponse<T>> {
    if (!this.db) {
      return Bluebird.reject(dbError);
    }
    const cursor = this.collection.find(filter);
    return Bluebird.resolve(cursor.count(false, filter))
      .then(count => defaultPaginationEngine.buildPageResponse(request, cursor, count));
  }

  public get(id: string): Bluebird<T> {
    if (!this.db) {
      return Bluebird.reject(dbError);
    }
    return Bluebird.resolve(this.collection.findOne({ id }));
  }

  public create(object: T): Bluebird<T> {
    object.id = object.id || generate();
    if (!this.db) {
      return Bluebird.reject(dbError);
    }
    return Bluebird.resolve(this.collection.insertOne(object))
      .then(() => this.get(object.id));
  }

  public update(object: T): Bluebird<T> {
    if (!this.db) {
      return Bluebird.reject(dbError);
    }
    const id = object.id;
    return Bluebird.resolve(this.collection.updateOne({ id }, object))
      .then(() => this.get(object.id));
  }

  public delete(id: string): Bluebird<boolean> {
    if (!this.db) {
      return Bluebird.reject(dbError);
    }
    return Bluebird.resolve(this.collection.deleteOne({ id }))
      .then(response => response.result.ok === 1);
  }

  /**
   * Inject database connection
   */
  public setDb(db: Db) {
    this.db = db;
    this.collection = this.db.collection<T>(this.collectionName);
  }
}
