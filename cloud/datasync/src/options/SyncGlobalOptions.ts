import * as sync from 'fh-sync'

/** 
 * List of global options passed to sync on init 
 **/
export interface SyncGlobalParameters {
  /** 
   * How often the scheduler should check the datasetClients, in ms.
   * Default: 500
   */
  schedulerInterval?: number;

  /** 
   * The default concurrency value when update dataset clients in the sync API. 
   * In most case this value should not need to be changed. 
   * Default is 10
   **/
  datasetClientUpdateConcurrency?: number;

  /**
   * If cache the dataset client records using redis. 
   * This can help improve performance for the syncRecords API.
   * Can be turned on if there are no records are shared between many different dataset clients. 
   * Default is false.
  */
  useCache?: boolean;

  /** 
   * Specify the frequency the datasetClient cleaner should run. 
   * Default every hour ('1h') */
  datasetClientCleanerCheckFrequency?: string;
}

/**
 * Global sync options used to initialize sync
 * @field datasetConfiguration - required mongodb and redis configuration
 */
interface SyncOptions {
  datasetConfiguration: SyncDataLayerOptions;
  globalSyncOptions?: SyncGlobalParameters;
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
 * Provide custom hash function to determine if object was changed
 */
export interface HashFunction {
  (object: any): any;
}

/**
 * Interface for handling collisions
 */
export interface CollisionHandler {
  // tslint:disable-next-line:max-line-length
  (datasetId: string, hash: string, timestamp: any, uid: string, pre: any, post: any, metaData: any, callback: sync.StandardCb<any>): void;
}

export default SyncOptions;