import * as assert from 'assert';
import * as proxyquire from 'proxyquire';
import { WfmRestApi } from '../src/index';

describe('FeedHenry Wfm api Tests', function() {
  describe('Test end user api', function() {
    it('create router', function() {
      const testSubject = new WfmRestApi();
      assert.ok(testSubject.createWFMRouter());
    });
  });

  describe('Test mongo setup', function() {
    it('create router', function() {
      const testSubject = new WfmRestApi();
      const db: any = {
        collection() {
          // noop
        }
      };
      testSubject.setDb(db);
    });
  });
});
