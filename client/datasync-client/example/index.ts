import * as sync from 'fh-sync-js';
import { DataManager } from '../src/DataManager';

// Provide backwards compatibility with documentation and examples
const $fh = { sync };
const datasetId = 'UserTasks';

const manager = new DataManager(datasetId);

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
  manager.create(task, function(err, data) {
    // tslint:disable-next-line:no-console
    console.log('Data Saved', data);
    manager.list(function(error, result) {
      // tslint:disable-next-line:no-console
      console.log('List of elements', result, error);
    });
    manager.update(data, function(error, result) {
      // tslint:disable-next-line:no-console
      console.log('Data updated', result , error);
    });
    manager.read(data.uid, function(error, result) {
      // tslint:disable-next-line:no-console
      console.log('Data read', result, error);
    });
    manager.delete(data, function(error, result) {
      // tslint:disable-next-line:no-console
      console.log('Data deleted', result , error);
    });
  });
});

// Using native sync for more advanced use cases.
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
