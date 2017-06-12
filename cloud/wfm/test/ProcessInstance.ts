import * as assert from 'assert';
import InstanceImpl, {ProcessInstance} from '../src/process-instance';
import Task from '../src/task';
describe('Task', function() {
  const instance: ProcessInstance = new InstanceImpl([
    new Task(),
    new Task(),
    new Task()
  ]);
  it('should contain a set of Tasks', function() {
    instance.tasks = [
      new Task(),
      new Task(),
      new Task()
    ];
  });

  it('should keep an assignment to a single User', function() {
    instance.assigneeId = 'trever';
  });

  it('should fire events related to a change in the active Task', function(done) {
    instance.on('task:change', function(e) {
      assert(e.instance === instance);
      done();
    });
    instance.currentTask = instance.tasks[1];
  });

  it('should fire an event when all Tasks are done');
});
