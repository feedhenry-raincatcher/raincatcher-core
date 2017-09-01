import SyncServer, { SyncApi, SyncExpressMiddleware, SyncOptions } from '@raincatcher/datasync-cloud';
import { getLogger } from '@raincatcher/logger';
import * as Promise from 'bluebird';
import appConfig from '../../util/Config';
import { GlobalMongoDataHandler } from './MongoDataHandler';

const sync = SyncServer;
const config = appConfig.getConfig();

// Enable sync debug logs
process.env.DEBUG = 'fh-mbaas-api:sync';

// Sync connection options
const connectOptions: SyncOptions = {
  datasetConfiguration: {
    mongoDbConnectionUrl: process.env.MONGO_CONNECTION_URL || appConfig.getConfig().mongodb.url,
    mongoDbOptions: appConfig.getConfig().mongodb.options,
    redisConnectionUrl: process.env.REDIS_CONNECTION_URL || appConfig.getConfig().redis.url
  },
  globalSyncOptions: { useCache: false }
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
        handler.initGlobalHandlers();
      }
      return resolve({ mongo, redis });
    });
  });
}
