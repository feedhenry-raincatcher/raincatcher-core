import SyncApi from './SyncApi';
import SyncOptions, { SyncDataLayerOptions } from './options/SyncGlobalOptions';
import SyncDataSetOptions from './options/SyncDatasetOptions';
import DataSetHandler from './crud-handlers/DataSetHandler'
// Wrapping sync api js code (no type definition supported)
const syncAPI: any = require('fh-sync').api;

/**
 * Implementation for sync api
 */
class FeedhenrySync implements SyncApi {

  public constructor() {
  }
  /**
   * Initialize sync server by connecting to database
   * 
   * @param options global options for initalisation of sync cloud service
   */
  public connect(options: SyncOptions, callback: (err: any) => void) {
    if (options.globalSyncOptions) {
      syncAPI.setConfig(options.globalSyncOptions);
    }
    if (options.globalHashFunction) {
      syncAPI.setGlobalHashFn(options.globalHashFunction);
    }
    const sdo = options.datasetConfiguration;
    syncAPI.connect(sdo.mongoDbConnectionUrl, sdo.mongoDbOptions, sdo.redisConnectionUrl, function (err: any) {
      callback(err);
    });
  }

  private setupHandlers(dataHandler: DataSetHandler) {
    if (dataHandler) {
      if (dataHandler.handleList) {
        syncAPI.handleList(dataHandler.handleList)
      }
      if (dataHandler.handleCreate) {
        syncAPI.handleCreate(dataHandler.handleCreate)
      }
      if (dataHandler.handleRead) {
        syncAPI.handleRead(dataHandler.handleRead)
      }
      if (dataHandler.handleUpdate) {
        syncAPI.handleUpdate(dataHandler.handleUpdate)
      }
      if (dataHandler.handleDelete) {
        syncAPI.handleDelete(dataHandler.handleDelete)
      }
    }
  }

  /**
   * Register dataset (implicitly) to be supported by server.
   * Note: datasets needs to be registered only if you wish to override values provided by server.
   * For example if you want to use custom CRUD handlers
   *
   * @param datasetId
   * @param options
   */
  public registerDatasetDataHandler(datasetId: string, options: SyncDataSetOptions, dataHandler?: DataSetHandler) {
    syncAPI.init(datasetId, options, function (err: any) {
      if (err) {
        throw new Error(err);
      } else {
        // set optional custom collision handler if its a function
        if (options && options.collisionHandler) {
          syncAPI.handleCollision(datasetId, options.collisionHandler);
        }

        // Set optional custom hash function to deal with detecting model changes.
        if (options && options.hashFunction) {
          syncAPI.setRecordHashFn(datasetId, options.hashFunction);
        }

        this.setupHandlers(dataHandler);
      }
    });
  }
}