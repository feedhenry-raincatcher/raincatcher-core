import * as Promise from 'bluebird';
import { DataService, STATUS, WorkOrder } from '../../src/index';
import { MockDataService } from './MockDataService';

const fixtures: WorkOrder[] = [
  {
    assignee: 'trever',
    id: 'completeWorkOrder',
    workflowId: 'singleStepWorkFlow',
    title: 'Complete Order',
    status: STATUS.COMPLETE
  },
  // This workorder has no result, is in a new state
  {
    assignee: 'trever',
    id: 'newWorkOrder',
    workflowId: 'multiStepWorkFlow',
    title: 'New Order',
    status: STATUS.NEW
  },
  {
    assignee: 'trever',
    id: 'brokenWorkOrder',
    workflowId: 'no workflow',
    title: 'WorkOrder without WorkFlow',
    status: STATUS.NEW
  }
];
const mockWorkorderService = new MockDataService<WorkOrder>(fixtures);

export { mockWorkorderService, fixtures };
