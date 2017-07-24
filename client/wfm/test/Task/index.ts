import * as assert from 'assert';
import { getRoundedStatus, Task, TaskStatus } from '../../src/task/Task';

describe('Task', function() {
  describe('getRoundedStatus', function() {
    let taskFixture: Task;
    let driverNotFoundStatus: number;

    beforeEach(function() {
      taskFixture = {
        id: '1',
        status: TaskStatus.Unassigned,
        assignee: 'trever',
        name: 'Fixture Task',
        code: 'FixtureTask',
        processInstanceId: '1'
      };
      driverNotFoundStatus = 404; // above TaskStatus['On Hold'] === 400
    });

    it('should ignore custom statuses', function() {
      taskFixture.status = driverNotFoundStatus;
      assert.equal(getRoundedStatus(taskFixture), TaskStatus['On Hold']);
    });
    it('should accept numbers', function() {
      assert.equal(getRoundedStatus(driverNotFoundStatus), TaskStatus['On Hold']);
    });
    it(`should default to TaskStatus.Aborted when the status isn't known` , function() {
      const bogusStatus = -123;
      taskFixture.status = bogusStatus;
      assert.equal(getRoundedStatus(taskFixture), TaskStatus.Aborted);
    });
  });
});
