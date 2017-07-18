import { logger } from '@raincatcher/logger';
import * as sync from 'fh-sync-js';

// Provide backwards compatibility with documentation and examples
const $fh = { sync };
const datasetId = 'UserTasks';
const log = new LoggerManager();

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
    log.logger.info('Data Saved', data);
    $fh.sync.doUpdate(datasetId, data.localId, function(result: any) {
      logger.info('Data updated', result,
        {level: 'INFO', tag: 'client:datasync-client:example', src: 'index.ts'});
    }, function(err) {
      logger.error('Error when Saving Data', err,
        {level: 'ERROR', tag: 'client:datasync-client:example', src: 'index.ts'});
    });
  }, function(err, data) {
    logger.error('Error when Saving Data', err,
      {level: 'ERROR', tag: 'client:datasync-client:example', src: 'index.ts'});
  });
});

$fh.sync.notify(datasetId, function(notification) {
  const code = notification.code;
  if ('sync_complete' === code) {
    $fh.sync.doList(datasetId,
      function(res) {
        logger.info('Successful result from list:', JSON.stringify(res),
          {level: 'INFO', tag: 'client:datasync-client:example', src: 'index.ts'});
      },
      function(err) {
        logger.error('Error result from list:', JSON.stringify(err),
          {level: 'ERROR', tag: 'client:datasync-client:example', src: 'index.ts'});
      });
  }
});
