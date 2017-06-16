import * as sync from 'fh-sync';
import DataSetHandler from './crud-handlers/DataSetHandler';
import {setupGlobalHandlers, setupHandlers} from './crud-handlers/HandlerMapper';
import SyncDataSetOptions from './options/SyncDatasetOptions';
import SyncOptions from './options/SyncGlobalOptions';
import SyncApi from './SyncApi';
import {BunyanLogger,LOG_LEVEL} from '../../logger-cloud/src/index';
//import {BunyanLogger,LOG_LEVEL} from '@raincatcher/logger-cloud'; this don't work 

const log = new BunyanLogger(LOG_LEVEL.DEBUG);

/**
 * Implementation for sync server side api
 */
export const SyncServer: SyncApi = {

  /**
   * Initialize sync server by connecting to database
   *
   * @param options global options for sync cloud service
   */
    connect(options: SyncOptions, callback: (err: any) => void) {
    if (options.globalSyncOptions) {
      sync.setConfig(options.globalSyncOptions);
    }
    const sdo = options.datasetConfiguration;
    sync.connect(sdo.mongoDbConnectionUrl, sdo.mongoDbOptions, sdo.redisConnectionUrl, function(err: any) {
      log.debug("SyncServer sync.connect Error", err);
      callback(err);
    });
  },

  setGlobalDataHandlers(dataHandler: DataSetHandler) {
    setupGlobalHandlers(dataHandler);
  },

  /**
   * Register dataset (implicitly) to be supported by server.
   * Note: datasets needs to be registered only if you wish to override values provided by server.
   * For example if you want to use custom CRUD handlers
   *
   * @param datasetId
   * @param options
   */
    registerDatasetDataHandler(datasetId: string, options: SyncDataSetOptions, dataHandler?: DataSetHandler) {
    sync.init(datasetId, options, function(err: any) {
      if (err) {
        log.debug("SyncServer sync.init Error", err);
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
        if (dataHandler) {
          setupHandlers(datasetId, dataHandler);
        }
      }
    });
  }
};

export default SyncServer;
