import BaseTask from '../../src/task';
import suite from './index';

describe('BaseTask', function() {
  let task: BaseTask;
  beforeEach(function() {
    task = new BaseTask();
  });

  suite(() => new BaseTask());

  describe('run', function() {
    it('should set the status to done');
  });
});
