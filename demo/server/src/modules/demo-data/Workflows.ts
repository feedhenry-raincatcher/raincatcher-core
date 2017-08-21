import { getLogger } from '@raincatcher/logger';
import * as Promise from 'bluebird';
import { Db } from 'mongodb';

const workflows = [
  {
    id: 'SyVXyMuSr', title: 'Vehicle Inspection Form', steps: [
      {
        code: 'vehicle-inspection', name: 'Vehicle Inspection',
        templates: {
          form: '<vehicle-inspection-form></vehicle-inspection-form>',
          view: '<vehicle-inspection value="result.submission"></vehicle-inspection>'
        }
      }
    ]
  }
];

export default function(collectionName: string, database: Db) {
  return database.collection(collectionName).count({}, {})
  .then(count => {
    if (count !== 0) {
      getLogger().info(`${count} workflows found, not re-initializing data`);
      return Promise.resolve(undefined);
    }
    getLogger().info('Generating sample workflows');
    return database.collection(collectionName).createIndex({
      id: 'hashed'
    });
  })
  .then(indexResult => indexResult ?
    database.collection(collectionName).insertMany(workflows) : Promise.resolve(undefined))
  .then(insertResult => {
    if (insertResult) {
      getLogger().info(`Generated ${insertResult.insertedCount} sample workflows`);
    }
    return insertResult;
  });
}
