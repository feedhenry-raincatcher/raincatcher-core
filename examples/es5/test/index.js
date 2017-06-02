const instance = require('../lib');
const baseSuite = require('@raincatcher/example-base/test');

describe('ES5 Instance', function() {
  describe('#customFunction', function() {
    it('should have an overridden result', function() {
      return /ES5/.test(instance.customFunction());
    });
    baseSuite(instance.class);
  });
});
