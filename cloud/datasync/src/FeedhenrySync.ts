import SyncApi from './SyncApi';
import SyncOptions, { SyncDataLayerOptions } from './options/SyncGlobalOptions';
import SyncDataSetOptions from './options/SyncDatasetOptions';

import { setupGlobalHandlers, setupHandlers } from './crud-handlers/HandlerMapper'
import DataSetHandler from './crud-handlers/DataSetHandler'

import { api } from 'fh-sync'

/**
 * Implementation for sync api
 */
export class FeedhenrySync implements SyncApi {

  public constructor() {
  }

  /**
   * Initialize sync server by connecting to database
   * 
   * @param options global options for sync cloud service
   */
  public connect(options: SyncOptions, callback: (err: any) => void) {
    if (options.globalSyncOptions) {
      console.log(api);
      api.setConfig(options.globalSyncOptions);
    }
    const sdo = options.datasetConfiguration;
    api.connect(sdo.mongoDbConnectionUrl, sdo.mongoDbOptions, sdo.redisConnectionUrl, function (err: any) {
      callback(err);
    });
  }

  setGlobalDataHandlers(dataHandler: DataSetHandler) {
    setupGlobalHandlers(dataHandler);
  };

  /**
   * Register dataset (implicitly) to be supported by server.
   * Note: datasets needs to be registered only if you wish to override values provided by server.
   * For example if you want to use custom CRUD handlers
   *
   * @param datasetId
   * @param options
   */
  public registerDatasetDataHandler(datasetId: string, options: SyncDataSetOptions, dataHandler?: DataSetHandler) {
    api.init(datasetId, options, function (err: any) {
      if (err) {
        throw new Error(err);
      } else {
        // set optional custom collision handler if its a function
        if (options && options.collisionHandler) {
          api.handleCollision(datasetId, options.collisionHandler);
        }

        // Set optional custom hash function to deal with detecting model changes.
        if (options && options.hashFunction) {
          api.setRecordHashFn(datasetId, options.hashFunction);
        }
        if (dataHandler) {
          setupHandlers(datasetId, dataHandler);
        }
      }
    });
  }
}

export default FeedhenrySync;