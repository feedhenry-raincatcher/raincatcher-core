const instance = require('../lib');
const baseSuite = require('@raincatcher/example-base/test').default;

describe('ES6 Instance', function() {
  describe('#customFunction', function() {
    it('should have an overridden result', function() {
      return /ES6/.test(instance.customFunction());
    });
    baseSuite(instance.class);
  });
});
