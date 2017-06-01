import RaincatcherBase from '../src';
import baseSuite from './index';

/**
 * Auxiliary class so we can have a parameter-less constructor
 * Could have stubs/spies, etc.
 */
class NoopRaincatcherBase extends RaincatcherBase {
  constructor() {
    super({
      log: () => undefined
    });
  }
}

describe('RaincatcherBase', function() {
  let subject: RaincatcherBase;
  beforeEach(function() {
    subject = new RaincatcherBase(console);
  });
  describe('#customFunction', function() {
    it('does it\'s own thing', function() {
      return subject.customFunction();
    });
  });

  // Delegate to public interface suite
  baseSuite(NoopRaincatcherBase);
});
