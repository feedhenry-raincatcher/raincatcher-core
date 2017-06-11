import SyncApi from '../SyncApi';
import SyncOptions, { SyncDataLayerOptions } from '../options/SyncGlobalOptions';
import SyncDataSetOptions from '../options/SyncDatasetOptions';
import DataSetHandler from '../crud-handlers/DataSetHandler'

const syncAPI: any = require('fh-sync').api;

/**
 * Maps dataHandler to sync api methods
 * 
 * @param syncAPI 
 * @param dataHandler 
 */
export function setupHandlers(syncAPI: any, dataHandler: DataSetHandler) {
    if (dataHandler.handleList) {
        syncAPI.handleList(dataHandler.handleList)
    }
    if (dataHandler.handleCreate) {
        syncAPI.handleCreate(dataHandler.handleCreate)
    }
    if (dataHandler.handleRead) {
        syncAPI.handleRead(dataHandler.handleRead)
    }
    if (dataHandler.handleUpdate) {
        syncAPI.handleUpdate(dataHandler.handleUpdate)
    }
    if (dataHandler.handleDelete) {
        syncAPI.handleDelete(dataHandler.handleDelete)
    }
}

/**
 * Maps global dataHandler to sync api methods
 * 
 * @param syncAPI 
 * @param dataHandler
 */
export function setupGlobalHandlers(syncAPI: any, dataHandler: DataSetHandler) {
    if (dataHandler) {
        if (dataHandler.handleList) {
            syncAPI.globalHandleList(dataHandler.handleList)
        }
        if (dataHandler.handleCreate) {
            syncAPI.globalHandleCreate(dataHandler.handleCreate)
        }
        if (dataHandler.handleRead) {
            syncAPI.globalHandleRead(dataHandler.handleRead)
        }
        if (dataHandler.handleUpdate) {
            syncAPI.globalHandleUpdate(dataHandler.handleUpdate)
        }
        if (dataHandler.handleDelete) {
            syncAPI.globalHandleDelete(dataHandler.handleDelete)
        }
    }
}