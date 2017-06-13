import SyncApi from '../SyncApi';
import SyncOptions, { SyncDataLayerOptions } from '../options/SyncGlobalOptions';
import SyncDataSetOptions from '../options/SyncDatasetOptions';
import DataSetHandler from '../crud-handlers/DataSetHandler'

import { api } from 'fh-sync'


/**
 * Maps dataHandler to sync api methods
 *
 * @param syncAPI
 * @param dataHandler
 */
export function setupHandlers(datasetId: string, dataHandler: DataSetHandler) {
  if (dataHandler.onList) {
    api.handleList(datasetId, dataHandler.onList);
  }
  if (dataHandler.onCreate) {
    api.handleCreate(datasetId, dataHandler.onCreate);
  }
  if (dataHandler.onRead) {
    api.handleRead(datasetId, dataHandler.onRead);
  }
  if (dataHandler.onUpdate) {
    api.handleUpdate(datasetId, dataHandler.onUpdate)
  }
  if (dataHandler.onDelete) {
    api.handleDelete(datasetId, dataHandler.onDelete)
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
      api.globalHandleList(dataHandler.onList);
    }
    if (dataHandler.onCreate) {
      api.globalHandleCreate(dataHandler.onCreate);
    }
    if (dataHandler.onRead) {
      api.globalHandleRead(dataHandler.onRead);
    }
    if (dataHandler.onUpdate) {
      api.globalHandleUpdate(dataHandler.onUpdate)
    }
    if (dataHandler.onDelete) {
      api.globalHandleDelete(dataHandler.onDelete)
    }
  }
}
