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
  database.collection(collectionName).count({}, function(err, count) {
    if (count !== 0) {
      return;
    }
    console.info('Saving workflows');
    database.collection(collectionName).insertMany(workflows);
  });
}
