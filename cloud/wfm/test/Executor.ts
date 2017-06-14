import * as assert from 'assert';
import * as Promise from 'bluebird';
import ExecutorImpl, { Executor, InstanceRepository } from '../src/executor';
import Process from '../src/process';
import { ProcessInstance } from '../src/process-instance';
import BaseTask, { Task, TaskStatus } from '../src/task';

describe('Executor', function() {
  class SingleRepository implements InstanceRepository {
    public savedInstance: ProcessInstance;
    public save(instance: ProcessInstance) {
      this.savedInstance = instance;
      return Promise.resolve(instance);
    }
  }
  const repository = new SingleRepository();
  const process = new Process('sample');
  process.tasks = [
    new BaseTask(),
    new BaseTask(),
    new BaseTask()
  ];
  let executor: Executor;

  it('wraps the creation of a Instance', function() {
    executor = new ExecutorImpl(process, repository);
    return Promise.resolve(executor);
  });
  it('can run the execution of the ProcessInstance and its Tasks', function(done) {
    executor = new ExecutorImpl(process, repository);
    if (!executor.instance) {
      return done(new Error('instance should not be null'));
    }
    executor.instance.on('process:done', function(e) {
      e.instance.getTasks().each<Task, void>(t => assert(t.getStatus() === TaskStatus.done));
      done();
    });
    executor.start();
  });
});
