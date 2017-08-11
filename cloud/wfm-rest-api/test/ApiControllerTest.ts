import * as assert from 'assert';
import * as Bluebird from 'bluebird';
import * as express from 'express';
import * as proxyquire from 'proxyquire';
import * as sinon from 'sinon';
import { MISSING_ID } from '../src/index';

import {
  ApiController, ApiError, MongoDbRepository,
  PageResponse, PagingDataRepository, SortedPageRequest
} from '../src/index';

interface TestEntity {
  id: number;
  name: string;
}
const testObj: TestEntity = { id: 1, name: 'test' };
const listReponse: PageResponse<TestEntity> = {
  data: [testObj],
  totalCount: 0,
  totalPages: 0
};

class MockRepository implements PagingDataRepository<TestEntity> {
  public list(filter: any, request: SortedPageRequest) {
    return Bluebird.resolve(listReponse);
  }

  public get(id: any): Bluebird<any> {
    return Bluebird.resolve(testObj);
  }

  public create(object: any): Bluebird<any> {
    return Bluebird.resolve(testObj);
  }

  public update(object: any): Bluebird<any> {
    return Bluebird.resolve(testObj);
  }

  public delete(id: any): Bluebird<any> {
    return Bluebird.resolve(testObj);
  }
}

const mockApi = {
  repository: new MockRepository(),
  apiPrefix: 'test'
};

describe('FeedHenry ApiController Tests', function() {
  describe('ApiController routes creation', function() {
    it('create router', function() {
      const router = express.Router();
      const repository = new MongoDbRepository('test');
      const testSubject = new ApiController(router, repository, 'testApi');
    });

    it('verify list middleware', function(done) {
      const router = express.Router();
      const repository = new MongoDbRepository('test');
      const testSubject = new ApiController(router, repository, 'testApi');
      const request = {
        query: {
          filter: '{}',
          page: 0,
          size: 1
        },
        body: {
          filter: {}
        }
      };
      const response = {
        json(data) {
          assert.equal(data, listReponse);
          done();
        },
        status(status) {
          return response;
        }
      };
      testSubject.listHandler.bind(mockApi)(request, response);
    });

    it('verify list middleware fail', function(done) {
      const router = express.Router();
      const repository = new MongoDbRepository('test');
      const testSubject = new ApiController(router, repository, 'testApi');
      const request = {
        query: {
          filter: {},
          page: 0,
          size: 1
        },
        body: {
          filter: {}
        }
      };
      const response = {
        json(data) {
          assert.ok(data);
          done();
        },
        status(status) {
          assert.ok(status);
          return response;
        }
      };
      testSubject.listHandler.bind(mockApi)(request, response);
    });

    it('verify get middleware error', function(done) {
      const router = express.Router();
      const repository = new MongoDbRepository('test');
      const testSubject = new ApiController(router, repository, 'testApi');
      const response = {
        json(data) {
          assert.equal(MISSING_ID, data.code);
          done();
        },
        status(status) {
          assert.equal(400, status);
          return response;
        }
      };
      testSubject.getHandler.bind(mockApi)({ params: {} }, response);
    });

    it('verify get middleware success', function(done) {
      const router = express.Router();
      const repository = new MongoDbRepository('test');
      const testSubject = new ApiController(router, repository, 'testApi');
      const response = {
        json(data) {
          assert.equal(testObj, data);
          done();
        },
        status(status) {
          assert.equal(400, status);
          return response;
        }
      };
      testSubject.getHandler.bind(mockApi)({ params: { id: 1 } }, response);
    });

    it('verify post middleware success', function(done) {
      const router = express.Router();
      const repository = new MongoDbRepository('test');
      const testSubject = new ApiController(router, repository, 'testApi');
      const response = {
        json(data) {
          assert.equal(testObj, data);
          done();
        }
      };
      testSubject.postHandler.bind(mockApi)({ body: testObj }, response);
    });

    it('verify put middleware success', function(done) {
      const router = express.Router();
      const repository = new MongoDbRepository('test');
      const testSubject = new ApiController(router, repository, 'testApi');
      const response = {
        json(data) {
          assert.equal(testObj, data);
          done();
        }
      };
      testSubject.putHandler.bind(mockApi)({ body: testObj }, response);
    });

    it('verify delete middleware success', function(done) {
      const router = express.Router();
      const repository = new MongoDbRepository('test');
      const testSubject = new ApiController(router, repository, 'testApi');
      const response = {
        json(data) {
          assert.ok(!data);
          done();
        }
      };
      testSubject.deleteHandler.bind(mockApi)({ params: { id: 1 } }, response);
    });

  });
});
