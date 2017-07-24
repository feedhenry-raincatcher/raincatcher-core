import * as assert from 'assert';
import * as Promise from 'bluebird';
import { find } from 'lodash';
import {getAggregateStatus, ProcessInstance} from '../../src/process-instance/ProcessInstance';
import {Task, TaskStatus} from '../../src/task/Task';

function createSampleTask(id: string, status: TaskStatus) {
  return {
    id,
    status,
    assignee: 'trever',
    name: 'Fixture Task',
    code: 'FixtureTask',
    processInstanceId: '1'
  };
}

describe('ProcessInstance', function() {
  describe('getAggregateStatus()', function() {
    let instanceFixture: ProcessInstance;
    let taskFixtures: Task[];
    function getTaskFromFixtures(id: string) {
      return Promise.resolve(find(taskFixtures, t => t.id === id) || taskFixtures[0]);
    }

    beforeEach(function() {
      instanceFixture = {
        id: '1',
        assignee: 'trever',
        process: '1',
        title: 'test ProcessInstance',
        comment: 'A ProcessInstance for unit testing',
        tasks: ['1', '2', '3']
      };
      taskFixtures = [
        createSampleTask('1', TaskStatus.New),
        createSampleTask('2', TaskStatus['In Progress'])
      ];
    });

    it('should get the lowest status in the process\' tasks', function() {
      return getAggregateStatus(instanceFixture, getTaskFromFixtures)
        .then(status => assert.equal(status , TaskStatus.New));
    });
    it('should report undefined for no Tasks', function() {
      instanceFixture.tasks = [];
      taskFixtures = [];

      return getAggregateStatus(instanceFixture, getTaskFromFixtures)
        .then(status => assert.equal(status , undefined));
    });
  });
});
