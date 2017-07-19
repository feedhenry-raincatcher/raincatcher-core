import { Db } from 'mongodb';
import worfklowSetup from './Workflows';
import workorderSetup from './Workorders';

export default function(database: Db) {
  workorderSetup('workorder', database);
  worfklowSetup('workflow', database);
}
