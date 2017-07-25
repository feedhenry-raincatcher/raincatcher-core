import { sync } from '@raincatcher/datasync-cloud';
import { logger } from '@raincatcher/logger';
import { Db, ObjectID } from 'mongodb';

/**
 * Initializes global mongodb data handlers for feedhenry sync
 * This class override default data handlers in sync to provide more flexible way of handling data.
 * @see https://github.com/feedhenry/fh-sync/blob/master/lib/default-dataHandlers.js
 *
 * In this datahandler we migrating from ObjectId identifiers to client generated ids.
 */
export class GlobalMongoDataHandler {
  /**
   * @param db MongoDb connection
   */
  constructor(private db: Db) {
  }

  /**
   * Init all setupHandlers for CRUD operations
   */
  public initGlobalHandlers() {
    this.setupHandleList();
    this.setupHandleCreate();
    this.setupHandleUpdate();
    this.setupHandleRead();
    this.setupHandleDelete();
  }

  public setupHandleList() {
    const self = this;
    sync.globalHandleList(function(datasetId, queryParams, metadata, cb) {
      logger.debug('GlobalHandleList called', datasetId, queryParams);
      queryParams = queryParams || {};
      const resultPromise = self.db.collection(datasetId).find(queryParams);
      return resultPromise.toArray().then(function(list: any[]) {
        return cb(undefined, self.toObject(list));
      }).catch(cb);
    });
  }

  public setupHandleCreate() {
    const self = this;
    sync.globalHandleCreate(function(datasetId, data, metadata, cb) {
      self.db.collection(datasetId).insertOne(data).then(function(res) {
        return cb(undefined, self.makeResponse(res.ops[0]));
      }).catch(cb);
    });
  }

  public setupHandleUpdate() {
    const self = this;
    sync.globalHandleUpdate(function(datasetId, uid, data, metadata, cb) {
      let query;
      if (data.id) {
        query = { id: data.id };
      } else {
        return cb(new Error('Expected the object to have an id field'));
      }
      return self.db.collection(datasetId).updateOne(query, data).then(function() {
        return cb(undefined, data);
      }).catch(cb);
    });
  }

  public setupHandleRead() {
    const self = this;
    sync.globalHandleRead(function(datasetId, uid, metadata, cb) {
      self.db.collection(datasetId).findOne({ 'id': uid})
        .then(function(result: any) {
          if (!result) {
            return cb(new Error('Missing result'));
          }
          delete result._id;
          return cb(undefined, result);
        }).catch(cb);
    });
  }

  public setupHandleDelete() {
    const self = this;
    sync.globalHandleDelete(function(datasetId, uid, metadata, cb) {
      self.db.collection(datasetId).deleteOne({ 'id': uid }).then(function(object: any) {
        return cb(undefined, object);
      }).catch(cb);
    });
  }

  /**
   * Formats results to format expected by sync
   * @param array
   */
  private toObject(array: any) {
    const data: any = {};
    array.forEach(function(value: any) {
      const uid = value.id;
      delete value._id;
      data[uid] = value;
    });
    return data;
  }

  /**
   * Enforces specific type of response for sync
   */
  private makeResponse(res: any) {
    const data = {
      uid: res.id,
      data: res
    };
    delete res._id;
    return data;
  }
}
