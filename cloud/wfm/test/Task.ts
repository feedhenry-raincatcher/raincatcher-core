// TODO
import BaseTask, {Task} from '../src/task';
describe('Task Interface', function() {
  it('should emit a statusChange event on a changed status');
  describe('#getStatus', function() {
    it('should round a custom status number to a value on the TaskStatus enum');
  });
  describe('#getOptionSchema', function() {
    it('should return the predefined JsonSchema object');
  });
  describe('#setOptions', function() {
    it('should allow a valid set of options on top of the schema');
    it('should not allow an invalid set of options on top of the schema');
  });
});

describe('BaseTask', function() {
  describe('run', function() {
    it('should set the status to done');
  });
});
