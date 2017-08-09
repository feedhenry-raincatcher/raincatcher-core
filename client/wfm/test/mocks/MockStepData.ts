import { Step } from '../../src/index';

const steps: Step[] = [
  {
    code: 'vehicle-inspection',
    name: 'First Step',
    templates: {
      form: '<vehicle-inspection-form></vehicle-inspection-form>',
      view: '<vehicle-inspection value=\result.submission\></vehicle-inspection>'
    }
  },
  {
    code: 'vehicle-inspection2',
    name: 'Second Step',
    templates: {
      form: '<vehicle-inspection-form></vehicle-inspection-form>',
      view: '<vehicle-inspection value=\result.submission\></vehicle-inspection>'
    }
  }
];

export { steps };
