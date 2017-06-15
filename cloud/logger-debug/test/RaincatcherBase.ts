import LoggerImpl from '../src';
import baseSuite from './index';

/**
 * Auxiliary class so we can have a parameter-less constructor
 * Could have stubs/spies, etc.
 */
class NoopRaincatcherBase extends LoggerImpl {
  constructor() {
    super();
  }
}

describe('RaincatcherBase', function() {
  // Use regular variables instead of mocha's `this` so it's strongly typed
  let subject: LoggerImpl;
  beforeEach(function() {
    subject = LoggerImpl.getInstance();
    subject.setNamespace('NoopRaincatcherBase');
  });

  describe('#customFunction', function() {
    it('should add the supplied prefix', function() {
      subject.debug('asdasd');
    });
  });

  // Delegate to public interface suite
  baseSuite();
});
