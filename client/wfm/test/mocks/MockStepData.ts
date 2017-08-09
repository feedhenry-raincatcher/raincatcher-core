import { Step } from '../../src/index';

const steps: Step[] = [
  {
    code: 'vehicle-inspection',
    name: 'Vehicle Inspection',
    templates: {
      form: '<vehicle-inspection-form></vehicle-inspection-form>',
      view: '<vehicle-inspection value=\result.submission\></vehicle-inspection>'
    }
  }
];

export { steps };
