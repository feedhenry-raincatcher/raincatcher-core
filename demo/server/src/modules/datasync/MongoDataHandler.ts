import { sync } from '@raincatcher/datasync-cloud';
import { MongoClient } from '@types/mongodb';

/**
 * Initializes global data handlers for feedhenry sync
 */
export class GlobalMongoDataHandler {
  constructor(private db: MongoClient) {
  }

  /**
   * Init all handlers for CRUD operations
   */
  public initGlobalHandlers() {
    this.handleList();
    this.handleCreate();
    this.handleSave();
    this.handleCreate();
    this.handleDelete();
  }

  public handleList() {
    sync.globalHandleList(function(datasetId, queryParams, metadata, cb) {
      queryParams = queryParams || {};
      let resultPromise = this.db.collection(datasetId).find(queryParams);
      if (queryParams.sort && typeof queryParams.sort === 'object') {
        resultPromise = resultPromise.sort(queryParams.sort);
      }
      return resultPromise.toArray().then(function(list: any[]) {
        const syncData: any = {};
        list.forEach(function(object) {
          syncData[object.id] = object;
        });
        return cb(undefined, syncData);
      }).catch(function(err: any) {
        return cb(err);
      });
    });
  }

  public handleCreate() {
    sync.globalHandleCreate(function(datasetId, data, metadata, cb) {
      this.db.collection(datasetId).insertOne(data).then(function() {
        const res = {
          uid: data.id,
          data
        };
        return cb(undefined, res);
      }).catch(function(err: any) {
        return cb(err);
      });
    });
  }

  public handleSave() {
    sync.globalHandleUpdate(function(datasetId, uid, data, metadata, cb) {
      let query;
      if (data._id) {
        delete data._id;
      }
      if (data.id) {
        query = { id: data.id };
      } else {
        return cb('Expected the object to have an id field');
      }
      return this.db.collection(datasetId).replaceOne(query, data).then(function() {
        return cb(undefined, data);
      }).catch(function(err: any) {
        return cb(err);
      });
    });
  }

  public handleRead() {
    sync.globalHandleRead(function(datasetId, uid, metadata, cb) {
      this.db.collection(datasetId).findOne({ id: uid })
        .then(function(result: any) {
          if (!result) {
            return cb('Missing result');
          }
          return cb(undefined, result);
        }).catch(function(err: any) {
          return cb(err);
        });
    });
  }

  public handleDelete() {
    sync.globalHandleDelete(function(datasetId, uid, metadata, cb) {
      this.db.collection(datasetId).deleteOne({ id: uid }).then(function(object: any) {
        return cb(undefined, object);
      }).catch(function(err: any) {
        return cb(err);
      });
    });
  }
}
