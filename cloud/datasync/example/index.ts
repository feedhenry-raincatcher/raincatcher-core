import { getLogger } from '@raincatcher/logger';
import SyncServer, { SyncApi, SyncExpressMiddleware, SyncOptions } from '../src/index';

const logger = getLogger();
const sync: SyncApi = SyncServer;

// Connect sync
const connectOptions: SyncOptions = {
  datasetConfiguration: {
    mongoDbConnectionUrl: process.env.MONGO_CONNECTION_URL || 'mongodb://127.0.0.1:27017/sync',
    mongoDbOptions: {},
    redisConnectionUrl: process.env.REDIS_CONNECTION_URL || 'redis://127.0.0.1:6379'
  },
  globalSyncOptions: { useCache: false }
};

sync.connect(connectOptions, function(err) {
  if (err) {
    logger.error(err);
  }
});

// Create express middleware
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';

const app = express();

// middleware
app.use(bodyParser.json());
app.use(cors());

const middleware: SyncExpressMiddleware = new SyncExpressMiddleware('/sync/:datasetId');
const router = middleware.createSyncExpressRouter();
app.use('/', router);

app.listen(3000, function() {
  logger.info('Example app listening on port 3000!');
});
// If you wish to see logs;
process.env.DEBUG = 'fh-mbaas-api:sync';
