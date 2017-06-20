import Task from '../../src/task/Task';
function suite(taskFactory: () => Task) {
  describe('Task Interface', function() {
    describe('#status property', function() {
      it('should emit a statusChange event when set');
      it('should not emit a statusChange event when set to the same value');
    });
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
}

export default suite;
