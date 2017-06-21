import * as assert from 'assert';
import ProcessInstance from '../../src/process-instance/ProcessInstance';
import Process from '../../src/process/Process';
import Task from '../../src/task/BaseTask';

function suite(processFactory: (name: string) => Process) {
  describe('Process', function() {
    let process: Process;
    beforeEach(function() {
      process = processFactory('Example Process');
      process.tasks = [
        new Task(),
        new Task(),
        new Task(),
        new Task()
      ];
    });
    it('should allow for defining a set of Steps', function() {
      assert(Array.isArray(process.tasks));
    });

    it('should be able to instantiate a ProcessInstance', function() {
      const instance: ProcessInstance = process.createInstance();
      instance.assigneeId = 'trever.id';
    });
  });
}

export default suite;