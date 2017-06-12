import FeedHenrySync from '../src/FeedhenrySync';

describe('FeedHenry Sync Tests', function() {
  // Use regular variables instead of mocha's `this` so it's strongly typed
  let testSubject: FeedHenrySync;
  beforeEach(function() {
    testSubject = new RaincatcherBase(console, { prefix: 'foo' });
  });
  describe('#customFunction', function() {
    it('should add the supplied prefix', function() {
      return /foo/.test(subject.customFunction());
    });
  });

  // Delegate to public interface suite
  baseSuite(NoopRaincatcherBase);
});
