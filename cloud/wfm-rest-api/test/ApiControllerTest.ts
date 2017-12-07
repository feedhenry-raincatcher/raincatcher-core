import * as Bluebird from 'bluebird';
import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as express from 'express';
import { Request } from 'express';
import * as proxyquire from 'proxyquire';
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
const filteredListResponse: PageResponse<TestEntity> = {
  data: [{id: '1', name: 'filter test'}],
  totalCount: 0,
  totalPages: 0
};

class MockRepository implements PagingDataRepository<TestEntity> {
  public list(filter) {
    if (Object.keys(filter).length !== 0) {
      return Bluebird.resolve(filteredListResponse);
    }
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
    it('verify list middleware success', function() {
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

    it('verify post middleware error', function() {
      return testSubject.postHandler({} as Request).catch(err => {
        expect(err).to.be.an('error');
        expect(err).to.have.property('code', 'CLIENT_ARGUMENT_ERROR');
        expect(err).to.have.property('statusCode', 400);
      });
    });

    it('verify put middleware success', function() {
      const request = { params: { id: 1 }, body: testObj };
      return expect(testSubject.putHandler(request as Request)).to.eventually.equal(testObj);
    });

    it('verify put middleware error (missing body)', function() {
      const request = { params: { id: 1 }};
      return testSubject.putHandler(request as Request).catch(err => {
        expect(err).to.be.an('error');
        expect(err).to.have.property('code', 'CLIENT_ARGUMENT_ERROR');
        expect(err).to.have.property('statusCode', 204);
      });
    });

    it('verify put middleware error (missing param id)', function() {
      const request = { params: {}, body: testObj};
      return testSubject.putHandler(request as Request).catch(err => {
        expect(err).to.be.an('error');
        expect(err).to.have.property('code', 'CLIENT_ARGUMENT_ERROR');
        expect(err).to.have.property('statusCode', 204);
      });
    });

    it('verify delete middleware success', function() {
      return expect(testSubject.deleteHandler({ params: { id: 1 } } as Request)).to.be.fulfilled;
    });

    it('verify delete middleware error', function() {
      return testSubject.deleteHandler({params: {}} as Request).catch(err => {
        expect(err).to.be.an('error');
        expect(err).to.have.property('code', 'MISSING_ID');
        expect(err).to.have.property('statusCode', 400);
      });
    });

    it('verify listByFilter middleware success', function() {
      const request = {
        query: {
          filter: '{"title": "test"}',
          page: 0,
          size: 1
        }
      };
      return testSubject.listByFilterHandler(request as Request).then((data) => {
        expect(data).to.be.equal(filteredListResponse);
      });
    });

    it('verify listByFilter middleware error', function() {
      const request = {
        query: {
          filter: 'test',
          page: 0,
          size: 1
        }
      };
      return testSubject.listByFilterHandler(request as Request).catch((err) => {
        expect(err).to.be.an('error');
        expect(err).to.have.property('code', 'CLIENT_ARGUMENT_ERROR');
        expect(err).to.have.property('statusCode', 400);
      });
    });

  });
});
