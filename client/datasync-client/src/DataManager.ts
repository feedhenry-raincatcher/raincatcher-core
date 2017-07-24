import * as syncApi from 'fh-sync-js';
import * as _ from 'lodash';

/**
 * Wrapper class around sync to allow easier operations on a single data set.
 *
 * Sor more information on the sync client API,
 * See https://tinyurl.com/yc5q3rj3
 */
export class DataManager {

  public datasetId: string;

  constructor(datasetId: string) {
    this.datasetId = datasetId;
  }

  /**
   * Listing all data for this data set.
   */
  public list(callback: (err?: Error, results?: any) => void) {
    const self = this;
    syncApi.doList(self.datasetId, function(syncDataSetList: any) {
      const dataSetData = self.extractDataFromSyncResponse(syncDataSetList);
      callback(undefined, dataSetData);
    }, function handleSyncListError(syncErrorCode: string, syncErrorMessage: string) {
      callback(new Error(self.formatSyncErrorMessage(syncErrorCode, syncErrorMessage)));
    });
  }

  /**
   * Adding a new item to the data set.
   *
   * @param itemToCreate - The item to add to the data set.
   */
  public create(itemToCreate: any, callback: (err?: Error, results?: any) => void) {
    const self = this;
    function handleCreateSuccess(syncDataCreateResult: any) {
      itemToCreate.uid = syncDataCreateResult.uid;
      callback(undefined, itemToCreate);
    }
    function handleCreateError(errorCode: string, syncErrorMessage: string) {
      callback(new Error(self.formatSyncErrorMessage(errorCode, syncErrorMessage)));
    }
    syncApi.doCreate(this.datasetId, itemToCreate, handleCreateSuccess, handleCreateError);
  }

  /**
   * Reading a single item from the data set.
   */
  public read(uid: string, callback: (err?: Error, result?: any) => void) {
    const self = this;
    function handleSuccess(syncDataCreateResult: any) {
      syncDataCreateResult.data.uid = uid;
      callback(undefined, syncDataCreateResult.data);
    }
    function handleError(errorCode: string, syncErrorMessage: string) {
      callback(new Error(self.formatSyncErrorMessage(errorCode, syncErrorMessage)));
    }
    syncApi.doRead(this.datasetId, uid, handleSuccess, handleError);
  }

  /**
   * Updating a single item in the data set.
   */
  public update(itemToUpdate: any, callback: (err?: Error, result?: any) => void) {
    const self = this;
    function handleSuccess(syncDataCreateResult: any) {
      callback(undefined, itemToUpdate);
    }
    function handleError(errorCode: string, syncErrorMessage: string) {
      callback(new Error(self.formatSyncErrorMessage(errorCode, syncErrorMessage)));
    }
    syncApi.doUpdate(this.datasetId, itemToUpdate.uid, itemToUpdate, handleSuccess, handleError);
  }

  /**
   * Deleting an item from the data set.
   *
   * @param itemToDelete
   */
  public delete(itemToDelete: any, callback: (err?: Error, result?: any) => void) {
    const self = this;
    function handleSuccess() {
      callback(undefined);
    }
    function handleError(errorCode: string, syncErrorMessage: string) {
      callback(new Error(self.formatSyncErrorMessage(errorCode, syncErrorMessage)));
    }
    syncApi.doDelete(this.datasetId, itemToDelete.uid, handleSuccess, handleError);
  }

  /**
   * Starting the sync management of the data set using the $fh.sync.startSync API.
   * This will start the sync loop, polling for updates
   * and pushing data to the remote server.
   *
   * See the sync Client API docs for more information on $fh.sync.startSync
   *
   * @returns {*}
   */
  public start(callback: (err?: Error, result?: any) => void) {
    syncApi.startSync(this.datasetId, function() {
      return callback();
    }, function(error) {
      return callback(error);
    });
  }

  /**
   * Stopping the sync process for this data set.
   *
   * This will stop the sync Client API from sending/recieving updates from the remote server.
   *
   * @returns {*}
   */
  public stop(callback: (err?: Error, result?: any) => void) {
    syncApi.startSync(this.datasetId, function() {
      return callback();
    }, function(error) {
      return callback(error);
    });
  }

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
