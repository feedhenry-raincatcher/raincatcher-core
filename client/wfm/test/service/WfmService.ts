import * as Promise from 'bluebird';
import { DataService, STATUS, WorkOrder } from '../../src/index';
import { mockWorkorderService } from '../mocks/WorkOrder';

describe('WfmService', function() {
  describe('#workorderSummary', function() {
    beforeEach(function() {
      mockWorkorderService.reset();
    });
    it('should return the correct data', function() {

    });
  });
  describe('#beginWorkflow', function() {
    it('should create the result for the workflow')
  });
  describe('#previousStep', function() {

  });

  describe('#completeStep', function() {

  });
});
