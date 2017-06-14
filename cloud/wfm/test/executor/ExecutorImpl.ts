import * as assert from 'assert';
import * as Promise from 'bluebird';
import ExecutorImpl, { InstanceRepository } from '../../src/executor';
import { ProcessInstance } from '../../src/process-instance';
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
