import * as Promise from 'bluebird';
import { DataService, STATUS, WorkFlow } from '../../src/index';
import { MockDataService } from './MockDataService';
import { steps } from './MockStepData';

const fixtures: WorkFlow[] = [
  {
    id: '1',
    title: 'Vehicle Inspection Form',
    steps: [steps[0]]
  },
  {
    id: '1',
    title: 'Vehicle Inspection Form',
    steps
  }
];
const mockWorkflowService = new MockDataService<WorkFlow>(fixtures);

export { mockWorkflowService, fixtures };
