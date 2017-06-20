import BooleanResult from '../../src/result/BooleanResult';
import suite from './index';

describe('BooleanResult', function() {
  suite(() => new BooleanResult(true));

  it('should have BooleanResult as its type');
  it('should accept a boolean value through the constructor');
});
