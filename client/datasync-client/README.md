# RainCatcher DataSync

Raincatcher DataSync is based on the[Feedhenry sync.js client](https://github.com/feedhenry/fh-sync-js)
For advanced usage of the Raincatcher DataSync module, see[FeedHenry Sync] (https://github.com/feedhenry/fh-sync/tree/master/docs) documentation.

## Overview

Raincatcher DataSync provides the following functionality:

- Allows synchronisation of WFM workorder data between the RainCatcher mobile client and the RainCatcher cloud server
- Allows mobile apps to use and update data offline (local cache)
- Provides a mechanism to manage bi-directional data synchronization from multiple Client Apps via the Cloud App and into back-end data stores
- Allows data updates (that is, deltas) to be distributed from the Cloud App to connected clients
- Provides facilities for managing data collisions from multiple updates in the cloud

This service effectively allows Sync apps to seamlessly continue working when the network connection is lost, and allow them to recover when the network connection is restored.

## Getting started with sync

### Init sync service

Init sync service to start processing data.

 ```typescript
import * as sync from 'fh-sync-js';

// Provide backwards compatibility with upstream documentation and examples
const $fh = { sync };

const options: sync.SyncOptions = {
  cloudUrl: 'http://localhost:3000',
  sync_frequency: 10,
  storage_strategy: 'dom'
};
$fh.sync.init(options);
```

### Register your local data collections

Sync introduces concept of `DataSets`. DataSets are form of local data collections
that will be managed and synchronized with server in sync loop.
In the following example,a new `UserTasks` dataset is registered.

 ```typescript
const datasetId = 'UserTasks';
// Parameters for retrieving server data
const queryParams = {};
const metaData = {};

$fh.sync.manage(datasetId, options, queryParams, metaData, function() {
    // callback code
});
```

### Perform operations on datasets

Sync provides a set of methods to perform create, read, update and delete operations on datasets.

 ```typescript
// Example object to save
const task: any = {
  name: 'test task',
  status: 'finished'
};

// Create and update object
$fh.sync.doCreate(datasetId, task, function(data) {
    console.log('Data Saved', data);
    $fh.sync.doUpdate(datasetId, data.localId, function(result: any) {
      console.log('Data updated', result);
    }, function(err) {
      console.log('Error when updating data', err);
    });
  }, function(err, data) {
    console.log('Error when saving Data', err);
  });

// Get list of elements
$fh.sync.doList(datasetId,function(res) {
    console.log('Successful result from list:', JSON.stringify(res));
  },
  function(err) {
    console.log('Error result from list:', JSON.stringify(err));
  });
```

### Monitor sync events

Developers can monitor sync specific events and react to them.

 ```typescript
$fh.sync.notify(datasetId, function(notification) {
  const code = notification.code;
  if ('sync_complete' === code) {
      console.log("Backend sync was completed");
  }
});
```

### More advanced usages

For advanced usage see [FeedHenry Sync documentation](https://github.com/feedhenry/fh-sync/tree/master/docs).
