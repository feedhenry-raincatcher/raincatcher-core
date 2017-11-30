/**
 * @module @raincatcher/wfm-demo-data
 */

import { getLogger } from '@raincatcher/logger';
import { WorkOrder } from '@raincatcher/wfm';
import * as Promise from 'bluebird';
import { Db } from 'mongodb';

import { WORKFLOWS } from './Workflows';

export const WORKORDERS: WorkOrder[] = [
  {
    id: 'rkX1fdSH',
    assignee: 'H1ZmkzOrr',
    title: 'Accident No. 3041',
    status: 'New',
    results: [],
    version: 1,
    created: new Date().getTime(),
    updated: new Date().getTime(),
    workflow: WORKFLOWS[0]
  }, {
    id: 'rJeXyfdrH',
    assignee: 'H1ZmkzOrr',
    title: 'Accident No. 3062',
    status: 'New',
    results: [],
    version: 1,
    created: new Date().getTime(),
    updated: new Date().getTime(),
    workflow: WORKFLOWS[0]
  }, {
    id: 'ByzQyz_BS',
    assignee: 'H1ZmkzOrr',
    title: 'Accident No. 3012',
    status: 'New',
    results: [],
    version: 1,
    created: new Date().getTime(),
    updated: new Date().getTime(),
    workflow: WORKFLOWS[0]
  }, {
    id: 'SJ8b3Mr8g',
    assignee: 'rkX1fdSH',
    title: 'Accident No. 3019',
    status: 'New',
    results: [],
    version: 1,
    created: new Date().getTime(),
    updated: new Date().getTime(),
    workflow: WORKFLOWS[0]
  }, {
    id: '3ycX4MuSr',
    assignee: 'rkX1fdSH',
    title: 'Accident No. 3011',
    status: 'New',
    results: [],
    version: 1,
    created: new Date().getTime(),
    updated: new Date().getTime(),
    workflow: WORKFLOWS[0]
  }, {
    id: '1ycX3guvr',
    assignee: 'rkX1fdSH',
    title: 'Accident No. 4001',
    status: 'New',
    results: [],
    version: 1,
    created: new Date().getTime(),
    updated: new Date().getTime(),
    workflow: WORKFLOWS[0]
  }, {
    id: 'HJ8QkzOSH',
    assignee: 'rkX1fdSH',
    title: 'Accident No. 4003',
    status: 'New',
    results: [],
    version: 1,
    created: new Date().getTime(),
    updated: new Date().getTime(),
    workflow: WORKFLOWS[0]
  }, {
    id: 'BJwQJfdrH',
    assignee: 'rkX1fdSH',
    title: 'Accident No. 3090',
    status: 'New',
    results: [],
    version: 1,
    created: new Date().getTime(),
    updated: new Date().getTime(),
    workflow: WORKFLOWS[0]
  }, {
    id: 'HJQTjsUr',
    assignee: 'BJQm1G_BS',
    title: 'Accident No. 3071',
    status: 'New',
    results: [],
    version: 1,
    created: new Date().getTime(),
    updated: new Date().getTime(),
    workflow: WORKFLOWS[0]
  }, {
    id: 'Syx76jiUH',
    assignee: 'BJQm1G_BS',
    title: 'Accident No. 3046',
    status: 'New',
    results: [],
    version: 1,
    created: new Date().getTime(),
    updated: new Date().getTime(),
    workflow: WORKFLOWS[0]
  }, {
    id: 'H1H76ij8r',
    assignee: 'HJ8QkzOSH',
    title: 'Accident No. 3084',
    status: 'New',
    results: [],
    version: 1,
    created: new Date().getTime(),
    updated: new Date().getTime(),
    workflow: WORKFLOWS[0]
  }, {
    id: 'BkuXajsIB',
    assignee: 'HJ8QkzOSH',
    title: 'Accident No. 3089',
    status: 'New',
    results: [],
    version: 1,
    created: new Date().getTime(),
    updated: new Date().getTime(),
    workflow: WORKFLOWS[0]
  }
];

export default function(collectionName: string, database: Db) {
  return database.collection(collectionName).count({}, {})
    .then(count => {
      if (count !== 0) {
        getLogger().info(`${count} workorders found, not re-initializing data`);
        return Promise.resolve(undefined);
      }
      getLogger().info('Generating sample workorders');
      return database.collection(collectionName).createIndex({
        id: 'hashed'
      });
    })
    .then(indexResult => indexResult ?
      database.collection(collectionName).insertMany(WORKORDERS) : Promise.resolve(undefined))
    .then(insertResult => {
      if (insertResult) {
        getLogger().info(`Generated ${insertResult.insertedCount} sample workorders`);
      }
      return insertResult;
    });
}
