import { getLogger } from '@raincatcher/logger';
import { WorkOrder } from '@raincatcher/wfm';
import * as Promise from 'bluebird';
import { Db } from 'mongodb';

export const WORKORDERS: WorkOrder[] = [
  {
    id: 'rkX1fdSH',
    workflowId: 'SyVXyMuSr',
    assignee: 'rkX1fdSH',
    title: 'Accident No. 3041',
    status: 'New'
  }, {
    id: 'rJeXyfdrH',
    workflowId: 'SyVXyMuSr',
    assignee: 'rkX1fdSH',
    title: 'Accident No. 3062',
    status: 'New'
  }, {
    id: 'ByzQyz_BS',
    workflowId: 'SyVXyMuSr',
    assignee: 'rkX1fdSH',
    title: 'Accident No. 3012',
    status: 'New'
  }, {
    id: 'SJ8b3Mr8g',
    workflowId: 'SyVXyMuSr',
    assignee: 'rkX1fdSH',
    title: 'Accident No. 3019',
    status: 'New'
  }, {
    id: '3ycX4MuSr',
    workflowId: 'SyVXyMuSr',
    assignee: 'rkX1fdSH',
    title: 'Accident No. 3011',
    status: 'New'
  }, {
    id: '1ycX3guvr',
    workflowId: 'SyVXyMuSr',
    assignee: 'rkX1fdSH',
    title: 'Accident No. 4001',
    status: 'New'
  }, {
    id: 'HJ8QkzOSH',
    workflowId: 'SyVXyMuSr',
    assignee: 'rkX1fdSH',
    title: 'Accident No. 4003',
    status: 'New'
  }, {
    id: 'BJwQJfdrH',
    workflowId: 'SyVXyMuSr',
    assignee: 'rkX1fdSH',
    title: 'Accident No. 3090',
    status: 'New'
  }, {
    id: 'HJQTjsUr',
    workflowId: 'SyVXyMuSr',
    assignee: 'BJQm1G_BS',
    title: 'Accident No. 3071',
    status: 'New'
  }, {
    id: 'Syx76jiUH',
    workflowId: 'SyVXyMuSr',
    assignee: 'BJQm1G_BS',
    title: 'Accident No. 3046',
    status: 'New'
  }, {
    id: 'HJbXpioIS',
    workflowId: 'SyVXyMuSr',
    assignee: 'BJQm1G_BS',
    title: 'Accident No. 3099',
    status: 'New'
  }, {
    id: 'ryMXaos8S',
    workflowId: 'SyVXyMuSr',
    assignee: 'BJQm1G_BS',
    title: 'Accident No. 3060',
    status: 'New'
  }, {
    id: 'H1H76ij8r',
    workflowId: 'HJ8QkzOSH',
    assignee: 'HJ8QkzOSH',
    title: 'Accident No. 3084',
    status: 'New'
  }, {
    id: 'BkuXajsIB',
    workflowId: 'SyVXyMuSr',
    assignee: 'HJ8QkzOSH',
    title: 'Accident No. 3089',
    status: 'New'
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
