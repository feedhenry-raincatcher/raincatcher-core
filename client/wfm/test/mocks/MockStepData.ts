import { Step } from '../../src/index';

const steps: Step[] = [
  {
    id: 'first-step',
    code: 'vehicle-inspection',
    name: 'First Step',
    templates: {
      form: '<vehicle-inspection-form></vehicle-inspection-form>',
      view: '<vehicle-inspection value=\result.submission\></vehicle-inspection>'
    }
  },
  {
    id: 'second-step',
    code: 'vehicle-inspection',
    name: 'Second Step',
    templates: {
      form: '<vehicle-inspection-form></vehicle-inspection-form>',
      view: '<vehicle-inspection value=\result.submission\></vehicle-inspection>'
    }
  }
];

export { steps };
