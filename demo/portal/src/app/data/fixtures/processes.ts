import { Process, TaskDefinition } from '@raincatcher/wfm';

export const processes: Process[] = [
  {
    id: 'HJ8QkzOSH',
    title: 'Inspect and Sign',
    description: 'Inspect a vehicle and collect the customer\'s signature',
    taskDefinitions: [
      {
        code: 'VehicleInspection',
        options: {
          'Include Full Engine Review': true,
          'Require Pictures': true
        }
      },
      {
        code: 'RiskAssessment',
        options: {}
      }
    ],
  },
  {
    id: 'B1r71fOBr',
    title: 'Assess Risk',
    description: 'Execute risk evaluation',
    taskDefinitions: [
      {
        code: 'RiskAssessment',
        options: {}
      }
    ],
  },
  {
    id: 'SyVXyMuSr',
    title: 'Inspect Vehicle',
    description: 'Execute risk evaluation',
    taskDefinitions: [
      {
        code: 'VehicleInspection',
        options: {}
      }
    ],
  }
];
