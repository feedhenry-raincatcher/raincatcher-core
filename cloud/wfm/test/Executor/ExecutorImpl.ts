import * as assert from 'assert';
import * as Promise from 'bluebird';
import ExecutorImpl from '../../src/executor/ExecutorImpl';
import ExecutorRepository from '../../src/executor/InstanceRepository';
import ProcessInstance from '../../src/process-instance/ProcessInstance';
import suite from './index';

class SingleRepository implements ExecutorRepository {
  public savedInstance: ProcessInstance;
  public saveInstance(instance: ProcessInstance) {
    this.savedInstance = instance;
    return Promise.resolve(instance);
  }
}

describe('ExecutorImpl', function() {
  suite(process => new ExecutorImpl(process, new SingleRepository()));
});
