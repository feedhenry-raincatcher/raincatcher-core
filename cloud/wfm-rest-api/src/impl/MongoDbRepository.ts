import * as Bluebird from 'bluebird';
import { Collection, Cursor, CursorCommentOptions, Db } from 'mongodb';
import { ObjectID } from 'mongodb';
import { generate } from 'shortid';
import { ApiError } from '../data-api/ApiError';
import { defaultPaginationEngine } from '../data-api/MongoPaginationEngine';
import { DIRECTION, SortedPageRequest } from '../data-api/PageRequest';
import { PageResponse } from '../data-api/PageResponse';
import { PagingDataRepository } from '../data-api/PagingDataRepository';
import * as errorCodes from './ErrorCodes';

const dbError: ApiError = new ApiError(errorCodes.DB_ERROR, 'MongoDbRepository database not intialized', 500);

/**
 * Service for performing data operations on mongodb database
 */
export class MongoDbRepository<T extends {
  id: string,
  _id?: string | ObjectID,
  version?: number,
  updated: number,
  created: number
}> implements PagingDataRepository<T> {

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
    try {
      const cursor = this.collection.find(filter);
      return Bluebird.resolve(cursor.count(false, filter))
        .then(count => defaultPaginationEngine.buildPageResponse(request, cursor, count))
        .catch(this.handleError);
    } catch (err) {
      return this.handleError(err);
    }
  }

  public get(id: string): Bluebird<T> {
    if (!this.db) {
      return Bluebird.reject(dbError);
    }
    return Bluebird.resolve(this.collection.findOne({ id })).catch(this.handleError);
  }

  public create(object: T): Bluebird<T> {
    object.id = object.id || generate();
    if (!this.db) {
      return Bluebird.reject(dbError);
    }
    object.version = 1;
    object.created = new Date().getTime();
    return Bluebird.resolve(this.collection.insertOne(object))
      .then(() => this.get(object.id))
      .catch(this.handleError);
  }

  public update(object: T): Bluebird<T> {
    if (!this.db) {
      return Bluebird.reject(dbError);
    }
    // Find update target by id, do not ask mongo to update the ObjectID
    delete object._id;
    const id = object.id;
    object.version = (object.version || 0) + 1;
    object.updated = new Date().getTime();
    return Bluebird.resolve(this.collection.updateOne({ id }, object))
      .then(() => this.get(object.id))
      .catch(this.handleError);
  }

  public delete(id: string): Bluebird<boolean> {
    if (!this.db) {
      return Bluebird.reject(dbError);
    }
    return Bluebird.resolve(this.collection.deleteOne({ id }))
      .then(response => response.result.ok === 1)
      .catch(this.handleError);
  }

  /**
   * Inject database connection
   */
  public setDb(db: Db) {
    this.db = db;
    this.collection = this.db.collection<T>(this.collectionName);
  }

  private handleError(err: Error) {
    const apiError = new ApiError(errorCodes.DB_ERROR, 'Cannot perform mongo query', 500, err);
    return Bluebird.reject(apiError);
  }
}
