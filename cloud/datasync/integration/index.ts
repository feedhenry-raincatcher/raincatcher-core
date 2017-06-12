import * as sync from '../src/index'

const api: sync.SyncApi = new sync.FeedhenrySync();

// Connect sync
const connectOptions: sync.SyncOptions = {
    datasetConfiguration: {
        mongoDbConnectionUrl: process.env.MONGO_CONNECTION_URL || "mongodb://127.0.0.1:27017/sync",
        mongoDbOptions: {},
        redisConnectionUrl: process.env.REDIS_CONNECTION_URL || "redis://127.0.0.1:6379"
    },
    globalSyncOptions: { useCache: false }
}

api.connect(connectOptions, function (err) {
    if (err) {
        console.log(err);
    }
})

// Create express middleware

import * as cors from 'cors';
import * as express from 'express';
import * as bodyParser from 'body-parser';

var app = express();

//middleware
app.use(bodyParser.json());
app.use(cors());

app.get('/', function (req: express.Request, res: express.Response) {
    res.send('Sample application is running!')
})

const middleware: sync.SyncExpressMiddleWare = new sync.SyncExpressMiddleWare('/sync/:datasetId');
const router = middleware.createSyncExpressRouter();
app.use(router);

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})