import { getLogger } from '@raincatcher/logger';
import { WorkOrder } from '@raincatcher/wfm';
import * as Promise from 'bluebird';
import { Db } from 'mongodb';

export const WORKORDERS: WorkOrder[] = [
  {
    id: 'rkX1fdSH',
    assignee: 'H1ZmkzOrr',
    title: 'Accident No. 3041',
    status: 'New',
    results: [],
    workflow: {
      id: 'SyVXyMuSr', version: 1, title: 'Vehicle Accident Workflow', steps: [
        {
          id: 'A33AC351h',
          code: 'accident-report-form', name: 'Accident Report',
          templates: {
            form: '<accident-report-form></accident-report-form>',
            view: '<accident-report value="result.submission"></accident-report>'
          }
        },
        {
          id: 'Bc3a951c',
          code: 'vehicle-inspection', name: 'Vehicle Inspection',
          templates: {
            form: '<vehicle-inspection-form></vehicle-inspection-form>',
            view: '<vehicle-inspection value="result.submission"></vehicle-inspection>'
          }
        }
      ]
    }
  }, {
    id: 'rJeXyfdrH',
    assignee: 'H1ZmkzOrr',
    title: 'Accident No. 3062',
    status: 'New',
    results: [],
    workflow: {
      id: 'SyVXyMuSr', version: 1, title: 'Vehicle Accident Workflow', steps: [
        {
          id: 'A33AC351h',
          code: 'accident-report-form', name: 'Accident Report',
          templates: {
            form: '<accident-report-form></accident-report-form>',
            view: '<accident-report value="result.submission"></accident-report>'
          }
        },
        {
          id: 'Bc3a951c',
          code: 'vehicle-inspection', name: 'Vehicle Inspection',
          templates: {
            form: '<vehicle-inspection-form></vehicle-inspection-form>',
            view: '<vehicle-inspection value="result.submission"></vehicle-inspection>'
          }
        }
      ]
    }
  }, {
    id: 'ByzQyz_BS',
    assignee: 'H1ZmkzOrr',
    title: 'Accident No. 3012',
    status: 'New',
    results: [],
    workflow: {
      id: 'SyVXyMuSr', version: 1, title: 'Vehicle Accident Workflow', steps: [
        {
          id: 'A33AC351h',
          code: 'accident-report-form', name: 'Accident Report',
          templates: {
            form: '<accident-report-form></accident-report-form>',
            view: '<accident-report value="result.submission"></accident-report>'
          }
        },
        {
          id: 'Bc3a951c',
          code: 'vehicle-inspection', name: 'Vehicle Inspection',
          templates: {
            form: '<vehicle-inspection-form></vehicle-inspection-form>',
            view: '<vehicle-inspection value="result.submission"></vehicle-inspection>'
          }
        }
      ]
    }
  }, {
    id: 'SJ8b3Mr8g',
    assignee: 'rkX1fdSH',
    title: 'Accident No. 3019',
    status: 'New',
    results: [],
    workflow: {
      id: 'SyVXyMuSr', version: 1, title: 'Vehicle Accident Workflow', steps: [
        {
          id: 'A33AC351h',
          code: 'accident-report-form', name: 'Accident Report',
          templates: {
            form: '<accident-report-form></accident-report-form>',
            view: '<accident-report value="result.submission"></accident-report>'
          }
        },
        {
          id: 'Bc3a951c',
          code: 'vehicle-inspection', name: 'Vehicle Inspection',
          templates: {
            form: '<vehicle-inspection-form></vehicle-inspection-form>',
            view: '<vehicle-inspection value="result.submission"></vehicle-inspection>'
          }
        }
      ]
    }
  }, {
    id: '3ycX4MuSr',
    assignee: 'rkX1fdSH',
    title: 'Accident No. 3011',
    status: 'New',
    results: [],
    workflow: {
      id: 'SyVXyMuSr', version: 1, title: 'Vehicle Accident Workflow', steps: [
        {
          id: 'A33AC351h',
          code: 'accident-report-form', name: 'Accident Report',
          templates: {
            form: '<accident-report-form></accident-report-form>',
            view: '<accident-report value="result.submission"></accident-report>'
          }
        },
        {
          id: 'Bc3a951c',
          code: 'vehicle-inspection', name: 'Vehicle Inspection',
          templates: {
            form: '<vehicle-inspection-form></vehicle-inspection-form>',
            view: '<vehicle-inspection value="result.submission"></vehicle-inspection>'
          }
        }
      ]
    }
  }, {
    id: '1ycX3guvr',
    assignee: 'rkX1fdSH',
    title: 'Accident No. 4001',
    status: 'New',
    results: [],
    workflow: {
      id: 'SyVXyMuSr', version: 1, title: 'Vehicle Accident Workflow', steps: [
        {
          id: 'A33AC351h',
          code: 'accident-report-form', name: 'Accident Report',
          templates: {
            form: '<accident-report-form></accident-report-form>',
            view: '<accident-report value="result.submission"></accident-report>'
          }
        },
        {
          id: 'Bc3a951c',
          code: 'vehicle-inspection', name: 'Vehicle Inspection',
          templates: {
            form: '<vehicle-inspection-form></vehicle-inspection-form>',
            view: '<vehicle-inspection value="result.submission"></vehicle-inspection>'
          }
        }
      ]
    }
  }, {
    id: 'HJ8QkzOSH',
    assignee: 'rkX1fdSH',
    title: 'Accident No. 4003',
    status: 'New',
    results: [],
    workflow: {
      id: 'SyVXyMuSr', version: 1, title: 'Vehicle Accident Workflow', steps: [
        {
          id: 'A33AC351h',
          code: 'accident-report-form', name: 'Accident Report',
          templates: {
            form: '<accident-report-form></accident-report-form>',
            view: '<accident-report value="result.submission"></accident-report>'
          }
        },
        {
          id: 'Bc3a951c',
          code: 'vehicle-inspection', name: 'Vehicle Inspection',
          templates: {
            form: '<vehicle-inspection-form></vehicle-inspection-form>',
            view: '<vehicle-inspection value="result.submission"></vehicle-inspection>'
          }
        }
      ]
    }
  }, {
    id: 'BJwQJfdrH',
    assignee: 'rkX1fdSH',
    title: 'Accident No. 3090',
    status: 'New',
    results: [],
    workflow: {
      id: 'SyVXyMuSr', version: 1, title: 'Vehicle Accident Workflow', steps: [
        {
          id: 'A33AC351h',
          code: 'accident-report-form', name: 'Accident Report',
          templates: {
            form: '<accident-report-form></accident-report-form>',
            view: '<accident-report value="result.submission"></accident-report>'
          }
        },
        {
          id: 'Bc3a951c',
          code: 'vehicle-inspection', name: 'Vehicle Inspection',
          templates: {
            form: '<vehicle-inspection-form></vehicle-inspection-form>',
            view: '<vehicle-inspection value="result.submission"></vehicle-inspection>'
          }
        }
      ]
    }
  }, {
    id: 'HJQTjsUr',
    assignee: 'BJQm1G_BS',
    title: 'Accident No. 3071',
    status: 'New',
    results: [],
    workflow: {
      id: 'SyVXyMuSr', version: 1, title: 'Vehicle Accident Workflow', steps: [
        {
          id: 'A33AC351h',
          code: 'accident-report-form', name: 'Accident Report',
          templates: {
            form: '<accident-report-form></accident-report-form>',
            view: '<accident-report value="result.submission"></accident-report>'
          }
        },
        {
          id: 'Bc3a951c',
          code: 'vehicle-inspection', name: 'Vehicle Inspection',
          templates: {
            form: '<vehicle-inspection-form></vehicle-inspection-form>',
            view: '<vehicle-inspection value="result.submission"></vehicle-inspection>'
          }
        }
      ]
    }
  }, {
    id: 'Syx76jiUH',
    assignee: 'BJQm1G_BS',
    title: 'Accident No. 3046',
    status: 'New',
    results: [],
    workflow: {
      id: 'SyVXyMuSr', version: 1, title: 'Vehicle Accident Workflow', steps: [
        {
          id: 'A33AC351h',
          code: 'accident-report-form', name: 'Accident Report',
          templates: {
            form: '<accident-report-form></accident-report-form>',
            view: '<accident-report value="result.submission"></accident-report>'
          }
        },
        {
          id: 'Bc3a951c',
          code: 'vehicle-inspection', name: 'Vehicle Inspection',
          templates: {
            form: '<vehicle-inspection-form></vehicle-inspection-form>',
            view: '<vehicle-inspection value="result.submission"></vehicle-inspection>'
          }
        }
      ]
    }
  }, {
    id: 'H1H76ij8r',
    assignee: 'HJ8QkzOSH',
    title: 'Accident No. 3084',
    status: 'New',
    results: [],
    workflow: {
      id: 'SyVXyMuSr', version: 1, title: 'Vehicle Accident Workflow', steps: [
        {
          id: 'A33AC351h',
          code: 'accident-report-form', name: 'Accident Report',
          templates: {
            form: '<accident-report-form></accident-report-form>',
            view: '<accident-report value="result.submission"></accident-report>'
          }
        },
        {
          id: 'Bc3a951c',
          code: 'vehicle-inspection', name: 'Vehicle Inspection',
          templates: {
            form: '<vehicle-inspection-form></vehicle-inspection-form>',
            view: '<vehicle-inspection value="result.submission"></vehicle-inspection>'
          }
        }
      ]
    }
  }, {
    id: 'BkuXajsIB',
    assignee: 'HJ8QkzOSH',
    title: 'Accident No. 3089',
    status: 'New',
    results: [],
    workflow: {
      id: 'SyVXyMuSr', version: 1, title: 'Vehicle Accident Workflow', steps: [
        {
          id: 'A33AC351h',
          code: 'accident-report-form', name: 'Accident Report',
          templates: {
            form: '<accident-report-form></accident-report-form>',
            view: '<accident-report value="result.submission"></accident-report>'
          }
        },
        {
          id: 'Bc3a951c',
          code: 'vehicle-inspection', name: 'Vehicle Inspection',
          templates: {
            form: '<vehicle-inspection-form></vehicle-inspection-form>',
            view: '<vehicle-inspection value="result.submission"></vehicle-inspection>'
          }
        }
      ]
    }
  }
];

export default function(collectionName: string, database: Db) {
  return database.collection(collectionName).count({}, {})
    .then(count => {
      if (count !== 0) {
        getLogger().info(`${count} workorders found, not re-initializing data`);
        return Promise.resolve(undefined);
      }
      getLogger().info('Generating sample workorders');
      return database.collection(collectionName).createIndex({
        id: 'hashed'
      });
    })
    .then(indexResult => indexResult ?
      database.collection(collectionName).insertMany(WORKORDERS) : Promise.resolve(undefined))
    .then(insertResult => {
      if (insertResult) {
        getLogger().info(`Generated ${insertResult.insertedCount} sample workorders`);
      }
      return insertResult;
    });
}
