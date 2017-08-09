import * as Promise from 'bluebird';
import { find } from 'lodash';
import { DataService, ResultService, STATUS, WorkOrderResult } from '../../src/index';
import { MockDataService } from './MockDataService';
import { steps } from './MockStepData';

const fixtures: WorkOrderResult[] = [
  {
    assignee: 'trever',
    id: '1',
    workorderId: '1',
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
    },
    status: STATUS.NEW
  }
];
class MockResultService extends MockDataService<WorkOrderResult> implements ResultService {
  public readByWorkorder(workorderId) {
    return Promise.resolve(find(this.data, item => item.id === workorderId));
  }
}
const mockWorkorderResultService = new MockResultService(fixtures);

export { mockWorkorderResultService, fixtures };
