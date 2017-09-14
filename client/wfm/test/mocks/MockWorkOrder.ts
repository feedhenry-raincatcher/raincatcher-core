import * as Promise from 'bluebird';
import { DataService, STATUS, WorkOrder } from '../../src/index';
import { MockDataService } from './MockDataService';
import { steps } from './MockStepData';

const fixtures: WorkOrder[] = [
  {
    id: 'new-workorder',
    assignee: 'rkX1fdSH',
    title: 'Accident No. 3041',
    status: STATUS.NEW,
    results: [],
    version: 1,
    created: 0,
    updated: 0,
    workflow: {
      id: 'SyVXyMuSr',
      version: 1,
      title: 'Vehicle Accident Workflow',
      steps,
      created: 0,
      updated: 0
    }
  },
  {
    id: 'in-progress-workorder',
    assignee: 'rkX1fdSH',
    title: 'Accident No. 3041',
    status: STATUS.PENDING,
    currentStep: steps[0].id,
    results: [],
    version: 1,
    created: 0,
    updated: 0,
    workflow: {
      id: 'SyVXyMuSr',
      version: 1,
      title: 'Vehicle Accident Workflow',
      steps,
      created: 0,
      updated: 0
    }
  },
  {
    id: 'complete-workorder',
    assignee: 'rkX1fdSH',
    title: 'Accident No. 3041',
    status: STATUS.COMPLETE,
    version: 1,
    created: 0,
    updated: 0,
    results: [
      {
        stepId: 'first-step',
        submission: {
          lights: true,
          tires: true,
          fuel: 50
        },
        submitter: 'rkX1fdSH',
        timestamp: 1504800162822
      },
      {
        stepId: 'second-step',
        submission: {
          lights: true,
          tires: true,
          fuel: 50
        },
        submitter: 'rkX1fdSH',
        timestamp: 1504800162822
      }
    ],
    workflow: {
      id: 'SyVXyMuSr',
      version: 1,
      title: 'Vehicle Accident Workflow',
      steps,
      created: 0,
      updated: 0
    }
  },
  {
    id: 'no-steps-workorder',
    assignee: 'rkX1fdSH',
    title: 'Accident No. 3041',
    status: STATUS.NEW,
    version: 1,
    created: 0,
    updated: 0,
    results: [],
    workflow: {
      id: 'SyVXyMuSr',
      version: 1,
      title: 'Vehicle Accident Workflow',
      steps: [],
      created: 0,
      updated: 0
    }
  },
  {
    id: 'unassigned-workorder',
    title: 'Accident No. 3041',
    status: STATUS.NEW,
    version: 1,
    created: 0,
    updated: 0,
    results: [],
    workflow: {
      id: 'SyVXyMuSr',
      version: 1,
      title: 'Vehicle Accident Workflow',
      steps,
      created: 0,
      updated: 0
    }
  }
];
const mockWorkorderService = new MockDataService<WorkOrder>(fixtures);

export { mockWorkorderService, fixtures };
