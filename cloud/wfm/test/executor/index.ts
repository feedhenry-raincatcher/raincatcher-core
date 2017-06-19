import * as assert from 'assert';
import * as Promise from 'bluebird';
import { Executor, InstanceRepository } from '../../src/executor';
import Process from '../../src/process';
import { ProcessInstance } from '../../src/process-instance';
import BaseTask, { Task, TaskStatus } from '../../src/task';

class NoopTask extends BaseTask {
  // BaseTask's implementation should be the same,
  // but this is so these tests don't rely on it
  public run() {
    this.status = TaskStatus.DONE;
  }
}

function suite(executorFactory: (process: Process) => Executor) {
  describe('Executor', function() {
    let executor: Executor;

    beforeEach(function() {
      const process = new Process('sample');
      process.tasks = [
        new NoopTask(),
        new NoopTask(),
        new NoopTask()
      ];
      executor = executorFactory(process);
    });

    it('wraps the creation of a Instance', function() {
      assert(executor.process);
      return Promise.resolve(executor);
    });
    it('can run the execution of the ProcessInstance and its Tasks', function(done) {
      if (!executor.instance) {
        return done(new Error('instance should not be null'));
      }
      executor.instance.on('done', function(e) {
        e.instance.getTasks()
          .each<Task, void>(t => assert(t.getStatus() === TaskStatus.DONE))
          .then(() => done())
          .catch(done);
      });
      executor.start();
    });
  });
}

export default suite;
