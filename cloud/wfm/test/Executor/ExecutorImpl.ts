import * as assert from 'assert';
import * as Promise from 'bluebird';
import ExecutorImpl from '../../src/executor/ExecutorImpl';
import InstanceRepository from '../../src/executor/InstanceRepository';
import ProcessInstance from '../../src/process-instance/ProcessInstance';
import suite from './index';

class SingleRepository implements InstanceRepository {
  public savedInstance: ProcessInstance;
  public save(instance: ProcessInstance) {
    this.savedInstance = instance;
    return Promise.resolve(instance);
  }
}

describe('ExecutorImpl', function() {
  suite(process => new ExecutorImpl(process, new SingleRepository()));
});
