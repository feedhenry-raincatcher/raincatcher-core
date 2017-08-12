import * as Bluebird from 'bluebird';
import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as express from 'express';
import { Request } from 'express';
import * as proxyquire from 'proxyquire';
import * as sinon from 'sinon';
import { MISSING_ID } from '../src/index';

chai.use(chaiAsPromised);

import {
  ApiController, ApiError,
  PageResponse, PagingDataRepository, SortedPageRequest
} from '../src/index';

interface TestEntity {
  id: string;
  name: string;
}
const testObj: TestEntity = { id: '1', name: 'test' };
const listResponse: PageResponse<TestEntity> = {
  data: [testObj],
  totalCount: 0,
  totalPages: 0
};

class MockRepository implements PagingDataRepository<TestEntity> {
  public list() {
    return Bluebird.resolve(listResponse);
  }

  public get() {
    return Bluebird.resolve(testObj);
  }

  public create(object) {
    return Bluebird.resolve(object);
  }

  public update(object) {
    return Bluebird.resolve(object);
  }

  public delete() {
    return Bluebird.resolve(true);
  }
}

describe('FeedHenry ApiController Tests', function() {
  let testSubject: ApiController<TestEntity>;
  beforeEach(function() {
    testSubject = new ApiController<TestEntity>(new MockRepository());
  });
  describe('ApiController routes creation', function() {
    it('verify list middleware', function() {
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
      return testSubject.listHandler(request as Request).then(data =>
        expect(data).to.equal(listResponse)
      );
    });

    it('verify list middleware fail', function() {
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
      return testSubject.listHandler(request as Request).then(data => {
        expect(data).to.be.equal(listResponse);
      });
    });

    it('verify get middleware error', function() {
      return expect(testSubject.getHandler({ params: {} } as Request))
        .to.eventually.be.rejectedWith(/id/);
    });

    it('verify get middleware success', function() {
      return expect(testSubject.getHandler({ params: { id: 1 } } as Request)).to.eventually.equal(testObj);
    });

    it('verify post middleware success', function() {
      return expect(testSubject.postHandler({ body: testObj } as Request)).to.eventually.equal(testObj);
    });

    it('verify put middleware success', function() {
      return expect(testSubject.putHandler({ body: testObj } as Request)).to.eventually.equal(testObj);
    });

    it('verify delete middleware success', function() {
      return expect(testSubject.deleteHandler({ params: { id: 1 } } as Request)).to.be.fulfilled;
    });

  });
});
