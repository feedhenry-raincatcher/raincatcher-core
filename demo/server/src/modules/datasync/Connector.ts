import SyncServer, { SyncApi, SyncExpressMiddleware, SyncOptions } from '@raincatcher/datasync-cloud';
import { getLogger } from '@raincatcher/logger';
import * as Promise from 'bluebird';
import appConfig from '../../util/Config';
import { excludeCompleteWorkOrders } from './filters/ExcludeCompletedWorkorders';
import { GlobalMongoDataHandler } from './MongoDataHandler';

const sync = SyncServer;
const config = appConfig.getConfig();

// Enable sync debug logs
process.env.DEBUG = 'fh-mbaas-api:sync';

// Sync connection options
const connectOptions: SyncOptions = {
  datasetConfiguration: {
    mongoDbConnectionUrl: appConfig.getConfig().mongodb.url,
    mongoDbOptions: appConfig.getConfig().mongodb.options,
    redisConnectionUrl: appConfig.getConfig().redis.url
  },
  globalSyncOptions: appConfig.getConfig().sync.globalOptions
};

/**
 * Promise wrapper for sync api connect method
 * @return promise
 * @see SyncApi.connect
 */
export function connect() {
  return new Promise(function(resolve, reject) {
    sync.connect(connectOptions, function(err, mongo, redis) {
      if (err) {
        getLogger().error('Error when trying to connect to mongo and redis', { err });
        return reject(err);
      }
      if (!mongo) {
        return reject('Missing mongo client');
      }
      if (config.sync.customDataHandlers) {
        const handler = new GlobalMongoDataHandler(mongo);
        const excludeDays = appConfig.getConfig().sync.excludeOldCompleteWorkOrders;
        if (excludeDays > 0) {
          handler.addListFilterModifier(excludeCompleteWorkOrders(excludeDays));
        }
        handler.initGlobalHandlers();
      }
      return resolve({ mongo, redis });
    });
  });
}
