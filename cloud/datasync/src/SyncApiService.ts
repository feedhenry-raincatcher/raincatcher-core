import SyncGlobalOptions from './syncOptions';


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
