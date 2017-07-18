import { Db } from 'mongodb';
import SyncDatasetOptions from './options/SyncDatasetOptions';
import SyncOptions from './options/SyncGlobalOptions';

/**
 * Interface for offline data sync solutions
 */
export interface SyncApi {
  /**
   * Connect sync service to database and cache servers. Setup middleware required to process sync calls from clients.
   * Method will If you wish to use sync with default data handlers and options that are passed from client app
   */
  connect(options: SyncOptions, callback: (err: any, mongoDbClient?: Db, redisClient?: any) => void): void;

  /**
   * Register dataset to be monitored by sync with particular data handlers
   */
  registerDatasetDataHandler(datasetId: string, options: SyncDatasetOptions): void;
}

export default SyncApi;
