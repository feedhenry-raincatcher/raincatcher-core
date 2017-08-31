# RainCatcher Sync Cloud

Raincatcher wrapper for Feedhenry DataSync server.
This module creates server side service that allows mobile applications to sync offline data to preferred database.
By default server connects and stores all client data in mongodb database.
This behavior can be changed by providing custom handlers.

For advanced usage see [FeedHenry Sync documentation](https://github.com/feedhenry/fh-sync/tree/master/docs).

> **Note**: Cloud service is utilized by one of the sync clients. See [datasync-js](../client/datasync)


## Quick start

1. Start sync service process

Starting sync service  will monitor and process
mew tasks are sent from sync clients

```typescript
import SyncServer, { SyncApi, SyncExpressMiddleware, SyncOptions } from '@raincatcher/datasync-cloud';
const sync: SyncApi = SyncServer;

// Connect sync
const connectOptions: SyncOptions = {
  // Use intelisense to get list of options
};
sync.connect(connectOptions, function(err) {
  if (err) {
    console.log(err);
  }
});
```

2. Create api endpoint for sync.

This endpoint will be called by all clients that wish to synchronize their local data with server.

```typescript
//middleware
app.use(bodyParser.json());
app.use(cors());

// Use api path of your wish
// Same endpoint needs to be configured in js client
const path = '/sync/:datasetId';
const middleware: SyncExpressMiddleware = new SyncExpressMiddleware();

const router = middleware.createSyncExpressRouter();
app.use('/', router);
```

See [integration](./integration) for complete runnable example.

## Accessing underlying sync library

For advanced use cases developers can access sync library using `sync` namespace.
Library is shipped with their own typings. You can import this directly into your application as below:

```typescript
import { sync } from '../src/index'
sync.anyapicall(...) ;
```

Where `anyapicall` is one of the types defined in:
https://github.com/feedhenry/fh-sync/blob/master/types/fh-sync.d.ts

For more advanced usages please follow [FeedHenry sync documentation](https://github.com/feedhenry/fh-sync/tree/master/docs)

## Overriding sync filter on server

By default sync clients can specify any type of filter and efectivelly get access to
every record for dataset. If you wish to disable user query_filters for certain datasets for security reasons `SyncMapperMiddleware` should be used, before mounting sync express router.
