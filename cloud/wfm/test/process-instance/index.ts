import * as assert from 'assert';
import InstanceImpl, {InstanceEventData, ProcessInstance} from '../../src/process-instance';
import BaseTask, {Task, TaskStatus} from '../../src/task';

function suite(instanceFactory: (seedData: Task[]) => ProcessInstance) {
  describe('implementing ProcessInstance', function() {
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

    it('nextTask() should fire events related to a change in the active Task', function(done) {
      instance.on('taskChange', function(e) {
        assert(e.instance === instance, 'Instance from event should be the same as the test fixture');
        done();
      });
      instance.nextTask();
    });

    it('should fire an event when all Tasks are done', function(done) {
      instance.on('done', e => {
        assert(e.instance === instance, 'Instance from event should be the same as the test fixture');
        done();
      });
      instance.getTasks()
        .each<Task, any>(task => task.status = TaskStatus.DONE);
    });
  });
}

export default suite;
