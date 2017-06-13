import * as assert from 'assert';
import InstanceImpl, {ProcessInstance} from '../../src/process-instance';
import BaseTask, {Task} from '../../src/task';

function suite(instanceFactory: (seedData: Task[]) => ProcessInstance) {
  describe('ProcessInstance', function() {
    let instance: ProcessInstance;
    beforeEach(function() {
      instance = instanceFactory([
        new BaseTask(),
        new BaseTask(),
        new BaseTask()
      ]);
    });
    it('should contain a readonly async set of Tasks', function() {
      return instance.getTasks()
        .then(tasks => assert(Array.isArray(tasks)) && assert(tasks[0] instanceof BaseTask));
    });

    it('should keep an assignment to a single User', function() {
      instance.assigneeId = 'trever';
    });

    it('next() should fire events related to a change in the active Task', function(done) {
      instance.on('task:change', function(e) {
        assert(e.instance === instance);
        done();
      });
      instance.next();
    });

    it('should fire an event when all Tasks are done');
  });
}

export default suite;
