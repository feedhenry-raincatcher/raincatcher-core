import * as Promise from 'bluebird';
import * as Logger from 'bunyan';
import * as Express from 'express';
import * as SyncApiService from './SyncApiService';
import {FeedhenrySyncOptions, SyncDataLayerOptions, SyncDataSetOptions} from './SyncApiService';
export * from './syncOptions';

const syncAPI: any = require('fh-sync').api;

const log = Logger.createLogger({ name: __filename, level: 'debug' });

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
    const promise = new Promise(function(resolve: () => void, reject: () => void) {
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
