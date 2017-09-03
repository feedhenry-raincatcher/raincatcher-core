import * as Promise from 'bluebird';
import { DataService, STATUS, WorkFlow } from '../../src/index';
import { MockDataService } from './MockDataService';
import { steps } from './MockStepData';

const fixtures: WorkFlow[] = [
  {
    id: 'singleStepWorkFlow',
    title: 'Vehicle Inspection Form',
    steps: [steps[0]]
  },
  {
    id: 'multiStepWorkFlow',
    title: 'Vehicle Inspection Form',
    steps
  }
];

export { fixtures };
