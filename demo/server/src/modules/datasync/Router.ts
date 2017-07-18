import SyncServer, { SyncApi, SyncExpressMiddleWare, SyncOptions } from '@raincatcher/datasync-cloud';

// Mount router at specific location
const middleware: SyncExpressMiddleWare = new SyncExpressMiddleWare('/:datasetId');
export const router = middleware.createSyncExpressRouter();
