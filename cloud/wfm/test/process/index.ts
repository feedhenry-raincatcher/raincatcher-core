import * as assert from 'assert';
import {Process} from '../../src/process';
import {ProcessInstance} from '../../src/process-instance';
import Task from '../../src/task';

function suite(processFactory: (name: string) => Process) {
  describe('Process', function() {
    let process: Process;
    beforeEach(function() {
      process = processFactory('Example Process');
    });
    it('should allow for defining a set of Steps', function() {
      process.tasks = [
        new Task(),
        new Task(),
        new Task(),
        new Task()
      ];
      assert(Array.isArray(process.tasks));
    });

    it('should be able to instantiate a ProcessInstance', function() {
      const instance: ProcessInstance = process.createInstance();
      instance.assigneeId = 'trever.id';
    });
  });
}

export default suite;
