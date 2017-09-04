import { Step } from '../../src/index';

const steps: Step[] = [
  {
    id: 'dagsdfa',
    code: 'vehicle-inspection',
    name: 'First Step',
    templates: {
      form: '<vehicle-inspection-form></vehicle-inspection-form>',
      view: '<vehicle-inspection value=\result.submission\></vehicle-inspection>'
    }
  },
  {
    id: 'fdsg23d',
    code: 'vehicle-inspection2',
    name: 'Second Step',
    templates: {
      form: '<vehicle-inspection-form></vehicle-inspection-form>',
      view: '<vehicle-inspection value=\result.submission\></vehicle-inspection>'
    }
  }
];

export { steps };
