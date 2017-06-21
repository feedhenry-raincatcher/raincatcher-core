import * as assert from 'assert';
import BaseTask from '../../src/task/BaseTask';
import {TaskStatus} from '../../src/task/Task';
import suite from './index';

describe('BaseTask', function() {
  let task: BaseTask;
  beforeEach(function() {
    task = new BaseTask();
  });

  suite(() => new BaseTask());

  describe('run', function() {
    it('should set the status to done', function() {
      task.run();
      assert.strictEqual(task.status, TaskStatus.DONE);
    });
  });
});
