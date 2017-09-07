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
    workflow: {
      id: 'SyVXyMuSr',
      version: 1,
      title: 'Vehicle Accident Workflow',
      steps
    }
  },
  {
    id: 'in-progress-workorder',
    assignee: 'rkX1fdSH',
    title: 'Accident No. 3041',
    status: STATUS.PENDING,
    currentStep: steps[0].id,
    results: [],
    workflow: {
      id: 'SyVXyMuSr',
      version: 1,
      title: 'Vehicle Accident Workflow',
      steps
    }
  },
  {
    id: 'complete-workorder',
    assignee: 'rkX1fdSH',
    title: 'Accident No. 3041',
    status: STATUS.COMPLETE,
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
      steps
    }
  },
  {
    id: 'no-steps-workorder',
    assignee: 'rkX1fdSH',
    title: 'Accident No. 3041',
    status: STATUS.NEW,
    results: [],
    workflow: {
      id: 'SyVXyMuSr',
      version: 1,
      title: 'Vehicle Accident Workflow',
      steps: []
    }
  },
  {
    id: 'unassigned-workorder',
    title: 'Accident No. 3041',
    status: STATUS.NEW,
    results: [],
    workflow: {
      id: 'SyVXyMuSr',
      version: 1,
      title: 'Vehicle Accident Workflow',
      steps
    }
  }
];
const mockWorkorderService = new MockDataService<WorkOrder>(fixtures);

export { mockWorkorderService, fixtures };
