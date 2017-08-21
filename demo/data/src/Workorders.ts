import { getLogger } from '@raincatcher/logger';
import { WorkOrder } from '@raincatcher/wfm';
import * as Promise from 'bluebird';
import { Db } from 'mongodb';

export const WORKORDERS: WorkOrder[] = [
  {
    id: 'rkX1fdSH',
    workflowId: 'SyVXyMuSr',
    assignee: 'rkX1fdSH',
    title: 'Footpath in disrepair',
    status: 'New'
  }, {
    id: 'rJeXyfdrH',
    workflowId: 'SyVXyMuSr',
    assignee: 'rkX1fdSH',
    title: 'Chimney in disrepair',
    status: 'New'
  }, {
    id: 'ByzQyz_BS',
    workflowId: 'SyVXyMuSr',
    assignee: 'rkX1fdSH',
    title: 'Wall in disrepair',
    status: 'New'
  }, {
    id: 'SJ8b3Mr8g',
    workflowId: 'SyVXyMuSr',
    assignee: 'rkX1fdSH',
    title: 'House in disrepair',
    status: 'New'
  }, {
    id: '3ycX4MuSr',
    workflowId: 'SyVXyMuSr',
    assignee: 'rkX1fdSH',
    title: 'Road in disrepair',
    status: 'New'
  }, {
    id: '1ycX3guvr',
    workflowId: 'SyVXyMuSr',
    assignee: 'rkX1fdSH',
    title: 'Driveway in disrepair',
    status: 'New'
  }, {
    id: 'HJ8QkzOSH',
    workflowId: 'SyVXyMuSr',
    assignee: 'rkX1fdSH',
    title: 'Door in disrepair',
    status: 'New'
  }, {
    id: 'BJwQJfdrH',
    workflowId: 'SyVXyMuSr',
    assignee: 'rkX1fdSH',
    title: 'Roof in disrepair',
    status: 'New'
  }, {
    id: 'HJQTjsUr',
    workflowId: 'SyVXyMuSr',
    assignee: 'BJQm1G_BS',
    title: 'Yard in disrepair',
    status: 'New'
  }, {
    id: 'Syx76jiUH',
    workflowId: 'SyVXyMuSr',
    assignee: 'BJQm1G_BS',
    title: 'Sprinkler in disrepair',
    status: 'New'
  }, {
    id: 'HJbXpioIS',
    workflowId: 'SyVXyMuSr',
    assignee: 'BJQm1G_BS',
    title: 'House in disrepair',
    status: 'New'
  }, {
    id: 'ryMXaos8S',
    workflowId: 'SyVXyMuSr',
    assignee: 'BJQm1G_BS',
    title: 'Tub in disrepair',
    status: 'New'
  }, {
    id: 'H1H76ij8r',
    workflowId: 'HJ8QkzOSH',
    assignee: 'HJ8QkzOSH',
    title: 'Carpet in disrepair',
    status: 'New'
  }, {
    id: 'BkuXajsIB',
    workflowId: 'SyVXyMuSr',
    assignee: 'HJ8QkzOSH',
    title: 'Sink in disrepair',
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
