import * as Promise from 'bluebird';
import { DataService, STATUS, WorkOrder } from '../../src/index';
import { MockDataService } from './MockDataService';

const fixtures: WorkOrder[] = [
  {
    id: 'rkX1fdSH',
    assignee: 'rkX1fdSH',
    title: 'Accident No. 3041',
    status: 'New',
    result: {},
    workflow: {
      id: 'SyVXyMuSr',
      title: 'Vehicle Accident Workflow',
      steps: []
    }
  }
];
const mockWorkorderService = new MockDataService<WorkOrder>(fixtures);

export { mockWorkorderService, fixtures };
