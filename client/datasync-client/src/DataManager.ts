import { getLogger } from '@raincatcher/logger';
import * as Bluebird from 'bluebird';
import * as syncApi from 'fh-sync-js';
import * as _ from 'lodash';

/**
 * Wrapper class around sync to allow easier operations on a single data set.
 *
 * For more information on the sync client API,
 * See https://github.com/feedhenry/fh-sync/blob/master/docs/sync_service.adoc 
 */
export class DataManager {
  public datasetId: string;

  constructor(datasetId: string) {
    getLogger().info('Creating DataManager for dataset: ' + datasetId);
    this.datasetId = datasetId;
  }

  /**
   * Listing all data for this data set.
   *
   * @returns Promise (bluebird)
   */
  public list(): Bluebird<any[]> {
    const self = this;
    return new Bluebird(function(resolve, reject) {
      syncApi.doList(self.datasetId, function(syncDataSetList: any) {
        const dataSetData = self.extractDataFromSyncResponse(syncDataSetList);
        resolve(dataSetData);
      }, function handleSyncListError(syncErrorCode: string, syncErrorMessage: string) {
        reject(new Error(self.formatSyncErrorMessage(syncErrorCode, syncErrorMessage)));
      });
    });
  }

  /**
   * Adding a new item to the data set.
   *
   * @param itemToCreate - The item to add to the data set.
   *
   * @returns Promise (bluebird)
   */
  public create(itemToCreate: any): Bluebird<any> {
    const self = this;
    return new Bluebird(function(resolve, reject) {
      function handleCreateSuccess(syncDataCreateResult: any) {
        itemToCreate.uid = syncDataCreateResult.uid;
        resolve(itemToCreate);
      }
      function handleCreateError(errorCode: string, syncErrorMessage: string) {
        reject(new Error(self.formatSyncErrorMessage(errorCode, syncErrorMessage)));
      }
      syncApi.doCreate(self.datasetId, itemToCreate, handleCreateSuccess, handleCreateError);
    });
  }

  /**
   * Reading a single item from the data set.
   */
  public read(uid: string): Bluebird<any> {
    const self = this;
    return new Bluebird(function(resolve, reject) {
      function handleSuccess(syncDataCreateResult: any) {
        syncDataCreateResult.data.uid = uid;
        return resolve(syncDataCreateResult.data);
      }
      function handleError(errorCode: string, syncErrorMessage: string) {
        return reject(new Error(self.formatSyncErrorMessage(errorCode, syncErrorMessage)));
      }
      syncApi.doRead(self.datasetId, uid, handleSuccess, handleError);
    });
  }

  /**
   * Updating a single item in the data set.
   */
  public update(itemToUpdate: any): Bluebird<any> {
    const self = this;
    return new Bluebird(function(resolve, reject) {
      function handleSuccess(syncDataCreateResult: any) {
        resolve(itemToUpdate);
      }
      function handleError(errorCode: string, syncErrorMessage: string) {
        reject(new Error(self.formatSyncErrorMessage(errorCode, syncErrorMessage)));
      }
      syncApi.doUpdate(self.datasetId, itemToUpdate.uid, itemToUpdate, handleSuccess, handleError);
    });
  }

  /**
   * Deleting an item from the data set.
   *
   * @param itemToDelete
   * @returns Promise (bluebird)
   */
  public delete(itemToDelete: any): Bluebird<any> {
    const self = this;
    return new Bluebird(function(resolve, reject) {
      function handleSuccess() {
        resolve();
      }
      function handleError(errorCode: string, syncErrorMessage: string) {
        reject(new Error(self.formatSyncErrorMessage(errorCode, syncErrorMessage)));
      }
      syncApi.doDelete(self.datasetId, itemToDelete.uid, handleSuccess, handleError);
    });
  }

  /**
   * Starting the sync management of the data set using the $fh.sync.startSync API.
   * This will start the sync loop, polling for updates
   * and pushing data to the remote server.
   *
   * See the sync Client API docs for more information on $fh.sync.startSync
   *
   * @returns Promise (bluebird)
   */
  public start(): Bluebird<any> {
    const self = this;
    return new Bluebird(function(resolve, reject) {
      syncApi.startSync(self.datasetId, function() {
        resolve();
      }, function(error) {
        reject(new Error(error));
      });
    });
  }

  /**
   * Stopping the sync process for this data set.
   *
   * This will stop the sync Client API from sending/recieving updates from the remote server.
   *
   * @returns Promise (bluebird)
   */
  public stop(): Bluebird<any> {
    const self = this;
    return new Bluebird(function(resolve, reject) {
      syncApi.stopSync(self.datasetId, function() {
        resolve();
      }, function(error) {
        return reject(new Error(error));
      });
    });
  }

  /**
   * Forcing the sync framework to do a sync request to the remote server to exchange data.
   *
   * @returns Promise (bluebird)
   */
  public forceSync(): Bluebird<any> {
    const self = this;
    return new Bluebird(function(resolve, reject) {
      syncApi.forceSync(self.datasetId, function() {
        resolve();
      }, function(error) {
        reject(new Error(error));
      });
    });
  }

  /**
   * A utility function to push any updates to the remote server and then stop syncing.
   * If there are pending sync operations, then force them to sync and then stop syncing.
   * Method can be used to ensure that all changes were saved to server before logout.
   *
   * @param userOptions - object that can contain delay
   * @returns {*}
   */
  public safeStop = function(userOptions) {
    const self = this;
    // Amount of time to wait before attempting stop.
    const defaultOptions = {
      delay: 5000
    };

    const options = _.defaults(userOptions, defaultOptions);
    function forceSyncThenStop(pendingUpdateQueueSize) {
      if (pendingUpdateQueueSize === 0) {
        return Bluebird.resolve(self.stop());
      }
      // Steps: force sync, wait, check if results were synced back, stop server
      return self.forceSync()
        .delay(options.delay)
        .then(self.getQueueSize.bind(self))
        .then(function(size) {
          if (size > 0) {
            return Bluebird.reject(new Error('forceSync failed, outstanding results still present'));
          }
        })
        .then(self.stop.bind(self));
    }
    return self.getQueueSize().then(forceSyncThenStop);
  };

  /**
   * Subscribe to sync changes in dataset
   *
   * @param dataUpdated - function to call when data is updated
   * @returns void
   */
  public subscribeToDatasetUpdates(dataUpdated) {
    syncApi.notify(this.datasetId, function(notification) {
      if (notification && notification.code === 'delta_received') {
        dataUpdated();
      }
    });
  }

  /**
   * Clears the cache for the dataset
   */
  public clearCache() {
    return syncApi.clearCache(this.datasetId);
  }

  /**
   * Get the current number of pending sync requests for this data set.
   */
  private getQueueSize = function() {
    const self = this;
    return new Bluebird(function(resolve) {
      syncApi.getPending(self.datasetId, function(pending?) {
        return resolve(_.size(pending));
      });
    });
  };

  /**
   * Extracting the Data Set data from a Sync Client API response
   *
   * See the sync Client API documentation for more information on
   * the response format of sync data set APIs (E.g. doList, doUpdate etc)
   *
   * @param syncResponse
   * @returns {Array}
   */
  private extractDataFromSyncResponse(syncResponse: any) {
    let dataSetData = _.keys(syncResponse).map((dataUid: string) => {
      // Only interested in the actual data from the sync response
      const syncData = syncResponse[dataUid];
      // Change format of the data by mapping id's
      syncData.data.uid = dataUid;
      return syncData.data;
    });
    dataSetData = _.compact(dataSetData);
    // Sorting the data set by their IDs
    return _.sortBy(dataSetData, (singleDataSetItem: any) => {
      return singleDataSetItem.id;
    });
  }

  /**
   * Utility function to format the sync error to the user.
   *
   * @param syncErrorCode - The error code returned from the $fh.sync API.
   * @param syncErrorMessage - The error message returned by the $fh.sync API
   * @returns {string}
   */
  private formatSyncErrorMessage(syncErrorCode: string, syncErrorMessage: string) {
    let error = 'Error';
    if (syncErrorCode && syncErrorMessage) {
      error += ' ' + syncErrorCode + ': ' + syncErrorMessage;
    } else if (syncErrorCode && !syncErrorMessage) {
      error += ': ' + syncErrorCode;
    } else if (!syncErrorCode && syncErrorMessage) {
      error += ': ' + syncErrorMessage;
    } else {
      error += ': no error details available';
    }
    return error;
  }
}
