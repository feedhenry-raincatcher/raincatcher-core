import { MongoClient } from '@types/mongodb';
import * as sync from 'fh-sync';
import SyncDataSetOptions from './options/SyncDatasetOptions';
import SyncOptions from './options/SyncGlobalOptions';
import SyncApi from './SyncApi';

/**
 * Implementation for sync server side api
 */
export const SyncServer: SyncApi = {

  /**
   * Initialize sync server by connecting to database
   *
   * @param options global options for sync cloud service
   */
  connect(options: SyncOptions, callback: (err: any, mongoDbClient?: MongoClient, redisClient?: any) => void) {
    if (options.globalSyncOptions) {
      sync.setConfig(options.globalSyncOptions);
    }
    const sdo = options.datasetConfiguration;
    sync.connect(sdo.mongoDbConnectionUrl, sdo.mongoDbOptions, sdo.redisConnectionUrl, function(err: any) {
      callback(err);
    });
  },

  /**
   * Register dataset (implicitly) to be supported by server.
   * Note: datasets needs to be registered only if you wish to override values provided by server.
   *
   * @param datasetId
   * @param options
   */
  registerDatasetDataHandler(datasetId: string, options: SyncDataSetOptions) {
    sync.init(datasetId, options, function(err: any) {
      if (err) {
        throw new Error(err);
      } else {
        // set optional custom collision handler if its a function
        if (options && options.collisionHandler) {
          sync.handleCollision(datasetId, options.collisionHandler);
        }

        // Set optional custom hash function to deal with detecting model changes.
        if (options && options.hashFunction) {
          sync.setRecordHashFn(datasetId, options.hashFunction);
        }
      }
    });
  }
};

export default SyncServer;
