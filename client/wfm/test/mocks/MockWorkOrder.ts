import * as Promise from 'bluebird';
import { DataService, STATUS, WorkOrder } from '../../src/index';
import { MockDataService } from './MockDataService';

const fixtures: WorkOrder[] = [
  {
    assignee: 'trever',
    id: '1',
    workflowId: '1',
    title: 'Complete Order',
    status: STATUS.COMPLETE
  },
  {
    assignee: 'trever',
    id: '2',
    workflowId: '2',
    title: 'New Order',
    status: STATUS.NEW
  }
];
const mockWorkorderService = new MockDataService<WorkOrder>(fixtures);

export { mockWorkorderService, fixtures };
