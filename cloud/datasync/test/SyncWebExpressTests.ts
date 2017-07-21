import * as assert from 'assert';
import {SyncExpressMiddleware} from '../src/index';

describe('FeedHenry Sync Express Tests', function() {
  let testSubject: SyncExpressMiddleware;

  beforeEach(function() {
    testSubject = new SyncExpressMiddleware('prefix');
  });

  describe('Test end user api', function() {
    it('createRouter', function() {
      assert.ok(testSubject.createSyncExpressRouter());
    });
    it('getRouter', function() {
      assert.ok(testSubject.getRouter());
    });
  });
});
