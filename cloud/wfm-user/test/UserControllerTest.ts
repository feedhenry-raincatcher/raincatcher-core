import * as Bluebird from 'bluebird';
import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as express from 'express';
import { Request } from 'express';
import * as proxyquire from 'proxyquire';
import * as sinon from 'sinon';

chai.use(chaiAsPromised);

import {
  User, UserController, UsersRepository
} from '../src/index';

interface TestEntity {
  id: string;
  name: string;
}

const testObj: TestEntity = { id: '1', name: 'Tom Smith' };
const listResponse = [testObj];
class MockRepository implements UsersRepository {
  public retrieveUsers(filter: string, limit: number): Bluebird<User[]> {
    return Bluebird.resolve(listResponse);
  }
}

describe('FeedHenry User Controller Tests', function() {
  let testSubject: UserController;
  beforeEach(function() {
    testSubject = new UserController(new MockRepository());
  });
  describe('ApiController routes creation', function() {
    it('verify list middleware', function() {
      const request = {
        query: {
          filter: 'Tom'
        }
      };
      return testSubject.listUsersHandler(request as Request).then(data =>
        expect(data).to.equal(listResponse)
      );
    });
    it('verify list middleware fails on missing filter', function() {
      const request = {
        query: {
          filter: ''
        }
      };
      return testSubject.listUsersHandler(request as Request).catch(err => {
        // tslint:disable-next-line:no-unused-expression
        expect(err).to.not.empty;
      });
    });
  });
  it('verify route creation', function() {
    // tslint:disable-next-line:no-unused-expression
    const router = testSubject.buildRouter();
    chai.assert(router);
  });
});
