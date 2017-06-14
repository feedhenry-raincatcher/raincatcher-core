import SyncApi from '../SyncApi';
import SyncOptions, { SyncDataLayerOptions } from '../options/SyncGlobalOptions';
import SyncDataSetOptions from '../options/SyncDatasetOptions';
import DataSetHandler from '../crud-handlers/DataSetHandler'

import * as sync from 'fh-sync'


/**
 * Maps dataHandler to sync api methods
 *
 * @param syncAPI
 * @param dataHandler
 */
export function setupHandlers(datasetId: string, dataHandler: DataSetHandler) {
  if (dataHandler.onList) {
    sync.handleList(datasetId, dataHandler.onList);
  }
  if (dataHandler.onCreate) {
    sync.handleCreate(datasetId, dataHandler.onCreate);
  }
  if (dataHandler.onRead) {
    sync.handleRead(datasetId, dataHandler.onRead);
  }
  if (dataHandler.onUpdate) {
    sync.handleUpdate(datasetId, dataHandler.onUpdate)
  }
  if (dataHandler.onDelete) {
    sync.handleDelete(datasetId, dataHandler.onDelete)
  }
}

/**
 * Maps global dataHandler to sync api methods
 *
 * @param syncAPI
 * @param dataHandler
 */
export function setupGlobalHandlers(dataHandler: DataSetHandler) {
  if (dataHandler) {
    if (dataHandler.onList) {
      sync.globalHandleList(dataHandler.onList);
    }
    if (dataHandler.onCreate) {
      sync.globalHandleCreate(dataHandler.onCreate);
    }
    if (dataHandler.onRead) {
      sync.globalHandleRead(dataHandler.onRead);
    }
    if (dataHandler.onUpdate) {
      sync.globalHandleUpdate(dataHandler.onUpdate)
    }
    if (dataHandler.onDelete) {
      sync.globalHandleDelete(dataHandler.onDelete)
    }
  }
}
