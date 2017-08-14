import * as assert from 'assert';
import * as Promise from 'bluebird';
import * as proxyquire from 'proxyquire';
import { MongoPaginationEngine } from '../src/index';

describe('FeedHenry PaginationEngine Tests', function() {
  describe('Test PaginationEngine api', function() {
    it('builds request ', function() {
      const testSubject = new MongoPaginationEngine(10);
      const query = {
        page: 1,
        size: 10,
        sortField: 'id',
        order: 1
      };
      const request = testSubject.buildRequestFromQuery(query);
      assert.equal(request.order, query.order);
      assert.equal(request.page, query.page);
      assert.equal(request.size, query.size);
      assert.equal(request.sortField, query.sortField);
    });
    it('builds request with defaults', function() {
      const defaultPageSize = 10;
      const testSubject = new MongoPaginationEngine(defaultPageSize);
      const query = {};
      const request = testSubject.buildRequestFromQuery(query);
      assert.equal(request.page, 0);
      assert.equal(request.size, defaultPageSize);
    });
    it('builds request ', function(done) {
      const testSubject = new MongoPaginationEngine(10);
      const result = ['test', 'test2'];
      const query = {
        page: 1,
        size: 10,
        sortField: 'id'
      };
      const request = testSubject.buildRequestFromQuery(query);
      assert.equal(request.page, query.page);
      assert.equal(request.size, query.size);
      const cursor: any = {
        sort(sortField, order) {
          assert.equal(request.sortField, sortField);
          assert.equal(request.order, order);
          return cursor;
        },
        skip(value) {
          assert.equal(request.size * request.page, value);
          return cursor;
        },
        limit(value) {
          assert.equal(request.size, value);
          return cursor;
        },
        toArray() {
          return Promise.resolve(result);
        }
      };
      const totalCount = 10;
      testSubject.buildPageResponse(request, cursor, totalCount).then(function(response) {
        assert.equal(response.totalPages, Math.ceil(totalCount / request.size));
        assert.equal(response.totalCount, totalCount);
        assert.equal(response.data, result);
        done();
      });
    });
  });
});
