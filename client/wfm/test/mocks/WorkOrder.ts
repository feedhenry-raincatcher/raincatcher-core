import * as Promise from 'bluebird';
import { DataService, STATUS, WorkOrder } from '../../src/index';
import { MockDataService } from './MockDataService';

const fixtures: WorkOrder[] = [
  {
    assignee: 'trever',
    id: '1',
    workflowId: '1',
    title: 'example Work Order',
    status: STATUS.NEW
  }
];
const mockWorkorderService = new MockDataService<WorkOrder>(fixtures);

export { mockWorkorderService, fixtures };
