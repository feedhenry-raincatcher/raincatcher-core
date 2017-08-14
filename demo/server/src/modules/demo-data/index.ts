import { Db } from 'mongodb';
import workflowSetup from './Workflows';
import workorderSetup from './Workorders';

/**
 * Module for initializing demo application with sample data.
 */
export default function(database: Db) {
  workorderSetup('workorders', database);
  workflowSetup('workflows', database);
}
