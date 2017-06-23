import * as sync from 'fh-sync-js';

// Provide backwards compatibility with documentation and examples
const $fh = { sync };
const datasetId = 'UserTasks';

const options: sync.SyncOptions = {
  cloudUrl: 'http://localhost:3000',
  sync_frequency: 10,
  storage_strategy: 'dom'
};

$fh.sync.init(options);

const queryParams = {};
const metaData = {};

const task: any = {
  name: 'test task',
  status: 'finished'
};

$fh.sync.manage(datasetId, options, queryParams, metaData, function() {
  $fh.sync.doCreate(datasetId, task, function(data) {
    // tslint:disable-next-line:no-console
    console.log('Data Saved', data);
    $fh.sync.doUpdate(datasetId, data.localId, function(result: any) {
       // tslint:disable-next-line:no-console
      console.log('Data updated', result);
    }, function(err) {
       // tslint:disable-next-line:no-console
      console.log('Error when Saving Data', err);
    });
  }, function(err, data) {
    // tslint:disable-next-line:no-console
    console.log('Error when Saving Data', err);
  });
});

$fh.sync.notify(datasetId, function(notification) {
  const code = notification.code;
  if ('sync_complete' === code) {
    $fh.sync.doList(datasetId,
      function(res) {
        // tslint:disable-next-line:no-console
        console.log('Successful result from list:', JSON.stringify(res));
      },
      function(err) {
        // tslint:disable-next-line:no-console
        console.log('Error result from list:', JSON.stringify(err));
      });
  }
});
