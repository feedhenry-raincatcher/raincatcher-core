import * as Promise from 'bluebird';
import { find } from 'lodash';
import { DataService, STATUS, WorkOrderResult } from '../../src/index';
import { MockDataService } from './MockDataService';
import { steps } from './MockStepData';

const fixtures: WorkOrderResult[] = [
  {
    stepResults: {
      'vehicle-inspection': {
        step: steps[0],
        submission: {
          fuel: 25,
          tires: true,
          lights: true
        },
        status: STATUS.COMPLETE,
        timestamp: 1502132714787,
        submitter: 'trever'
      }
    }
  }
];

export { fixtures };
