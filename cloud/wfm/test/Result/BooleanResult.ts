import * as assert from 'assert';
import BooleanResult from '../../src/result/BooleanResult';
import suite from './index';

describe('BooleanResult', function() {
  suite(() => new BooleanResult(true));
  let result: BooleanResult;
  let falseResult: BooleanResult;
  beforeEach(function() {
    result = new BooleanResult(true);
    falseResult = new BooleanResult(false);
  });

  it('should have BooleanResult as its type', function() {
    assert.strictEqual(result.type, 'BooleanResult');
  });
  it('should accept a boolean value through the constructor', function() {
    assert.strictEqual(result.value, true);
    assert.strictEqual(falseResult.value, false);
  });
});
