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
  describe('#workorderSummary', function() {
    it('should return the correct data for a complete workorder', function() {
      return subject.workorderSummary('completeWorkOrder').then(summary => {
        expect(summary.workorder.id).to.equal('completeWorkOrder');
        expect(summary.workflow.id).to.equal('singleStepWorkFlow');
      });
    });

    it('should return the correct data for a new workorder', function() {
      return subject.workorderSummary('newWorkOrder').then(summary => {
        expect(summary.workorder.id).to.equal('newWorkOrder');
        expect(summary.workflow.id).to.equal('multiStepWorkFlow');
        // tslint:disable-next-line:no-unused-expression
        expect(summary.result).to.be.undefined;
      });
    });

    it('should error when workorder has no workflow', function() {
      return expect(subject.workorderSummary('brokenWorkOrder')).to.eventually.be.rejected;
    });

    it('should error when workorder is not found', function() {
      return expect(subject.workorderSummary('fake id')).to.eventually.be.rejected;
    });
  });

  describe('#beginWorkflow', function() {
    it('should create the result for the workorder', function() {
      return subject.beginWorkflow('newWorkOrder').then(data => {
        expect(data.result && data.workorder.id).to.equal('newWorkOrder');
      });
    });

    it('should error on an already begun workorder', function() {
      return expect(subject.beginWorkflow('completeWorkOrder')).to.eventually.be.rejected;
    });
  });

  describe('#previousStep', function() {
    it('should decrement the step index', function() {
      return subject.previousStep('completeWorkOrder').then(data => {
        // this workorder only has one step, so it should go back to -1
        expect(data.nextStepIndex).to.equal(-1);
        // in this case the next step should be the first one
        expect(data.step.name).to.equal('First Step');
      });
    });

    it('should error if there\'s no result', function() {
      return expect(subject.previousStep('brokenWorkOrder')).to.be.eventually.rejected;
    });
  });

  describe('#completeStep', function() {
    it('should increment the step index', function() {
      return subject.completeStep({
        workorderId: 'completeWorkOrder',
        submission: vehicleInspectionSubmission,
        stepCode: 'vehicle-inspection'
      }).then(data => {
        expect(data.nextStepIndex).to.equal(1);
        expect(data.workorder.status).to.equal(STATUS.COMPLETE_DISPLAY);
        // would be nice to have `?.` here...
        // see  https://github.com/tc39/proposal-optional-chaining
        const stepResult: StepResult | undefined = data.result &&
          data.result.stepResults &&
          data.result.stepResults['vehicle-inspection'];
        expect(stepResult && stepResult.status).to.equal(STATUS.COMPLETE);
      });
    });
    it('should add a stepResult for the step and update the WorkOrderResult', function() {
      return subject.beginWorkflow('newWorkOrder')
        .then(() => subject.completeStep({
          workorderId: 'newWorkOrder',
          submission: vehicleInspectionSubmission,
          stepCode: 'vehicle-inspection'
        }).then(data => {
          expect(data.result && data.result.status).to.equal(STATUS.PENDING_DISPLAY);
          expect(data.workorder.status).to.equal(STATUS.PENDING_DISPLAY);
          const stepResult: StepResult | undefined = data.result &&
            data.result.stepResults &&
            data.result.stepResults['vehicle-inspection'];
          expect(stepResult && stepResult.status).to.equal(STATUS.COMPLETE);
          expect(stepResult && stepResult.step.name).to.equal('First Step');
        }));
    });
    it('should error if there\'s no result', function() {
      return expect(subject.completeStep({
        workorderId: 'brokenWorkOrder',
        submission: vehicleInspectionSubmission,
        stepCode: 'vehicle-inspection'
      })).to.eventually.be.rejected;
    });
  });
});
