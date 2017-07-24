import SyncServer, { SyncApi, SyncExpressMiddleware, SyncOptions } from '@raincatcher/datasync-cloud';

// Mount router at specific location
const middleware: SyncExpressMiddleware = new SyncExpressMiddleware('');
export const router = middleware.createSyncExpressRouter();
