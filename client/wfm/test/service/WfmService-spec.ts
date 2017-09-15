// TODO unit tests for new WFM

import * as Promise from 'bluebird';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { DataService, STATUS, StepResult, WfmService, WorkOrder } from '../../src/index';
import { mockUserService } from '../mocks/MockUserService';
import { mockWorkorderService } from '../mocks/MockWorkOrder';

chai.use(chaiAsPromised);
const { expect } = chai;

const vehicleInspectionSubmission = {
  'fuel': 25,
  'tires': true,
  'lights': true
};

describe('WfmService', function() {
  let subject: WfmService;
  beforeEach(function() {
    mockWorkorderService.reset();
    subject = new WfmService(mockWorkorderService, mockUserService);
  });

  describe('#begin', function() {
    it('should noop if the workorder isn\'t new', function() {
      return subject.readWorkOrder('complete-workorder')
        .then(workorder => subject.begin(workorder))
        .then(workorder => expect(workorder.status).to.equal(STATUS.COMPLETE));
    });
    it('should error out when no steps are available', function() {
      return expect(subject.readWorkOrder('no-steps-workorder')
        .then(workorder => subject.begin(workorder))).to.be.rejected;
    });
    it('should error out when workorder has no assignee', function() {
      return expect(subject.readWorkOrder('unassigned-workorder')
        .then(workorder => subject.begin(workorder))).to.be.rejected;
    });
    it('should initialize values correctly', function() {
      return subject.readWorkOrder('new-workorder')
        .then(workorder => subject.begin(workorder))
        .then(workorder => {
          expect(workorder.status).to.equal(STATUS.PENDING);
          expect(workorder.currentStep).to.equal(workorder.workflow.steps[0].id);
        });
    });
  });

  describe('#completeStep', function() {
    const submission = {
      lights: true,
      tires: true,
      fuel: 50
    };
    it('shouldn\'t accept workorders that have not begun', function() {
      return expect(subject.completeStep('new-workorder', submission)).to.be.rejected;
    });
    it('should move the workorder to the next step', function() {
      return subject.completeStep('in-progress-workorder', submission)
        .then(workorder => expect(workorder.results.length).to.equal(1));
    });
  });

  describe('#previousStep', function() {
    it('should move to the previous step', function() {
      return subject.previousStep('second-step-workorder')
        .then(workorder => expect(workorder.currentStep).to.equal(workorder.workflow.steps[0].id));
    });
    it('should reset status to new when moving back from the first step', function() {
      return subject.previousStep('in-progress-workorder')
        .then(workorder => {
          // tslint:disable-next-line:no-unused-expression
          expect(workorder.currentStep).to.be.undefined;
          expect(workorder.status).to.equal(STATUS.NEW);
        });
    });
  });

  describe('#getStepForResult', function() {
    it('should get the right step', function() {
      return subject.readWorkOrder('complete-workorder')
        .then(workorder => subject.getStepForResult(workorder.results[0], workorder))
        .then(step => expect(step && step.id).to.equal('first-step'));
    });
  });

  describe('#getCurrentStepIdx', function() {
    it('return the correct index', function() {
      return expect(subject.readWorkOrder('in-progress-workorder')
        .then(subject.getCurrentStepIdx)).to.eventually.equal(0);
    });
    it('should return -1 for workorders without current step', function() {
      return expect(subject.readWorkOrder('new-workorder')
        .then(subject.getCurrentStepIdx)).to.eventually.equal(-1);
    });
  });
});
