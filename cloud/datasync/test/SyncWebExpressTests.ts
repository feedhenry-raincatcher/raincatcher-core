import { SyncExpressMiddleWare} from '../src/index';
import * as proxyquire from "proxyquire";
import * as assert from 'assert';

describe("FeedHenry Sync Express Tests", function () {
  let testSubject: SyncExpressMiddleWare;

  beforeEach(function () {
    testSubject = new SyncExpressMiddleWare("prefix");
  });

  describe('Test end user api', function () {
    it('createRouter', function () {
      assert.ok(testSubject.createSyncExpressRouter());
    });
    it('getRouter', function () {
      assert.ok(testSubject.getRouter());
    });
  });
});
