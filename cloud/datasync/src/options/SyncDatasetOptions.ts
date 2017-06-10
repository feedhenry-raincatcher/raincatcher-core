import { CollisionHandler, HashFunction } from "./syncGlobalOptions";

/**
 * Options used to initialize single dataset
 */
interface SyncDataSetOptions {
  /**
   * Value indicating how often the dataset client should be sync with the backend. Matches the clients default 
   * frequency. Value in seconds
   */
  syncFrequency?: Number,

  /**
   * Value that will be used to decide if the dataset client is not active anymore.
   */
  clientSyncTimeout?: Number,

  /**
   * a value that determins how long it should wait for the backend list operation to complete
   */
  backendListTimeout?: Number,
  //Specify the max wait time the dataset can be scheduled to sync again after its previous schedule, in seconds.
  maxScheduleWaitTime?: Number

  // Collision handler for dataset
  collisionHandler?: CollisionHandler;
  
  // Function that returns hash string (or any unique string) to determine if dataset was changed
  hashFunction?: HashFunction;
}

/**
 * Complete set of options for dataset initialization
 */
export default SyncDataSetOptions;

