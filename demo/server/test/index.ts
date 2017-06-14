/// <reference types="mocha" />
import * as assert from 'assert';

function baseSuite( ) {
  describe('Base', function() {
    beforeEach(function() {
        assert.ok('Test');
    });

    describe('#foo()', function() {
      it('foo', function() {
        assert.ok('Test');
      });
    });
  });
}

export default baseSuite;
