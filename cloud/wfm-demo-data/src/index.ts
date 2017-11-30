/**
 * @module @raincatcher/wfm-demo-data
 */

import { Db } from 'mongodb';
import workflowSetup from './Workflows';
import workorderSetup from './Workorders';

/**
 * Module for initializing demo application with sample data
 * that will be saved into local mongodb instance
 */
export default function(database: Db) {
  workorderSetup('workorders', database);
  workflowSetup('workflows', database);
}
