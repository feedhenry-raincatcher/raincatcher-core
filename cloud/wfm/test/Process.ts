import Process from '../src/process';
import ProcessInstance from '../src/process-instance';
import Task from '../src/task';
describe('Workflow', function() {
  const process = new Process('Example Workflow');
  it('should allow for defining a set of Steps', function() {
    process.tasks = [
      new Task(),
      new Task(),
      new Task(),
      new Task()
    ];
  });

  it('should be able to instantiate a ProcessInstance', function() {
    const task: ProcessInstance = process.toInstance();
    task.assigneeId = 'trever.id';
  });
});
