import * as Promise from 'bluebird';
import * as Logger from 'bunyan';
import * as Express from 'express';
import SyncGlobalOptions from './syncOptions';

export * from './syncOptions';

const syncAPI: any = require('fh-sync').api;
const log = Logger.createLogger({ name: __filename, level: 'debug' });

/**
 * Top level sync interface
 */
export interface SyncApiService {

  /**
   * Register dataset to be monitored by sync
   */
  registerDataset(datasetId: string, options: SyncDataSetOptions): void;
}

export default SyncApiService;

/**
 * Provide custom hash function to determine if object was changed
 */
export interface HashFunction {
   function(object: any): any;
}

/**
 * Required options for sync
 */
export interface SyncDataLayerOptions {
  mongoDbConnectionUrl: string;
  mongoDbOptions: any;
  redisConnectionUrl: string;
}

/**
 * Global sync options used to initialize sync
 *
 * @field datasetConfiguration - required mongodb and redis configuration
 */
export interface FeedhenrySyncOptions {
  datasetConfiguration: SyncDataLayerOptions;
  globalSyncOptions?: SyncGlobalOptions;
  globalHashFunction?: HashFunction;
}

/**
 * Complete set of options for dataset initialization
 */
export interface SyncDataSetOptions {
  collisionHandler?: CollisionHandler;
  hashFunction?: HashFunction;
}

/**
 * Interface for handling collisions
 */
export interface CollisionHandler {
  // tslint:disable-next-line:max-line-length
  function(datasetId: string, hash: string, timestamp: string, uid: any, pre: any, post: any, metaData: any, cb: any): void;
}

/**
 * Implementation for sync api
 */
class FeedhenrySync implements SyncApiService {
  // Promise for sync
  private syncIntialized: Promise<any>;

  public constructor(options: FeedhenrySyncOptions) {
    if (options.globalSyncOptions) {
      syncAPI.setConfig(options.globalSyncOptions);
    }
    if (options.globalHashFunction) {
      syncAPI.setGlobalHashFn(options.globalHashFunction);
    }
    this.syncIntialized = this.initSync(options.datasetConfiguration);
  }

  /**
   * Register dataset (implicitly) to be supported by server
   * Note: in recent version of sync this method is not required until we want to introduce custom store.
   *
   * @param datasetId
   * @param options
   */
  public registerDataset(datasetId: string, options?: SyncDataSetOptions) {
    syncAPI.init(datasetId, options, function(err: any) {
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
      }
    });
  }

  private initSync(sdo: SyncDataLayerOptions) {
    const promise = new Promise(function (resolve: () => void, reject: () => void) {
      const mongoDbConnectionUrl = sdo.mongoDbConnectionUrl;
      syncAPI.connect(sdo.mongoDbConnectionUrl, sdo.mongoDbOptions, sdo.redisConnectionUrl, function () {
        resolve();
      });
    });
    return promise;
  }

}

/**
 * fh-sync module
 * TODO add documentation
 */
function syncModule() {
  const router: Express.Router = Express.Router();
  const syncRoute = router.route('mbaas/sync/:datasetId');

  /**
   * Sync express api required for sync clients
   * All sync clients will call that endpoint to sync data
   */
  syncRoute.post(function(req: Express.Request, res: Express.Response) {
    const datasetId = req.params.datasetId;
    const params = req.body;
    syncAPI.invoke(datasetId, params, function(err: any, result: any) {
      if (err) {
        res.status(500).json(err);
        return;
      }
      return res.json(result);
    });
  });
  return router;
}
