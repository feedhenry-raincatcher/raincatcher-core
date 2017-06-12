import * as assert from 'assert';
import * as Promise from 'bluebird';
import ExecutorImpl, { Executor, InstanceRepository } from '../src/executor';
import Process from '../src/process';
import { ProcessInstance } from '../src/process-instance';
import BaseStep, { TaskStatus } from '../src/task';

describe('Executor', function() {
  class SingleRepository implements InstanceRepository {
    public savedInstance: ProcessInstance;
    public save(instance: ProcessInstance) {
      this.savedInstance = instance;
      return Promise.resolve(instance);
    }
  }
  class NullStep extends BaseStep {
    public run() {
      // does nothing but advance to next status
      this.status += 100;
    }
  }

  const repository = new SingleRepository();
  const process = new Process('sample');
  process.tasks = [
    new NullStep(),
    new NullStep(),
    new NullStep()
  ];
  let executor: Executor;

  it('wraps the creation of a Instance', function() {
    executor = new ExecutorImpl(process, repository);
    return Promise.resolve(executor);
  });
  it('Can start the execution of the Task and its Steps', function(done) {
    executor = new ExecutorImpl(process, repository);
    if (!executor.instance) {
      return done(new Error('instance should not be null'));
    }
    executor.instance.on('process:done', function(e) {
      assert(e.instance.currentTask.getStatus() === TaskStatus.done);
    });
    executor.start();
  });
});
