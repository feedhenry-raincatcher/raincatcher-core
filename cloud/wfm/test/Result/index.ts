import * as assert from 'assert';
import Result from '../../src/result/Result';
function suite(resultFactory: () => Result) {
  describe('Result', function() {
    let result: Result;
    beforeEach(function() {
      result = resultFactory();
    });

    it('contains a type value', function() {
      assert(!!result.type);
    });
  });
}

export default suite;
