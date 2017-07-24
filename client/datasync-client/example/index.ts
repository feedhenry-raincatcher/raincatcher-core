import { logger } from '@raincatcher/logger';
import * as sync from 'fh-sync-js';
import { DataManager } from '../src/DataManager';

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
  const manager = new DataManager(datasetId);
  manager.create(task, function(err, data) {
    logger.info('Data Saved', data, { tag: 'client:datasync-client:example'});
    manager.list(function(error, result) {
      logger.error('List of elements', result, error, { tag: 'client:datasync-client:example'});
    });
    manager.update(data, function(error, result) {
      logger.info('Data updated', result , error, { tag: 'client:datasync-client:example'});
    });
    manager.read(data.uid, function(error, result) {
      logger.info('Data read', result, error, { tag: 'client:datasync-client:example'});
    });
    manager.delete(data, function(error, result) {
      logger.info('Data deleted', result , error, { tag: 'client:datasync-client:example'});
    });
  });
});

// Using native sync for more advanced use cases.
$fh.sync.notify(datasetId, function(notification) {
  const code = notification.code;
  if ('sync_complete' === code) {
    $fh.sync.doList(datasetId,
      function(res) {
        logger.info('Successful result from list:', res,
          {tag: 'client:datasync-client:example'});
      },
      function(err) {
        logger.error('Error result from list:', err,
          {tag: 'client:datasync-client:example'});
      });
  }
});
