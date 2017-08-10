import { getLogger } from '@raincatcher/logger';
import * as express from 'express';
import { MongoClient } from 'mongodb';
import * as path from 'path';
import { WfmRestApi } from '../src/index';

const app = express();

// Create api
const api = new WfmRestApi();

// Mount api into path
app.use('/api', api.createWFMRouter());

// Use connect method to connect to the server
const url = 'mongodb://localhost:27017/raincatcher';
MongoClient.connect(url, function(err, db) {
  if (db) {
    api.setDb(db);
  } else {
    console.info('MongoDb not connected', err);
    process.exit(1);
  }
});

app.use(function(err: any, req: express.Request, res: express.Response, next: any) {
  getLogger().error(err);
  res.status(500).send(err);
});

app.listen(3000, function() {
  getLogger().info('Example auth app listening on port 3000');
});
