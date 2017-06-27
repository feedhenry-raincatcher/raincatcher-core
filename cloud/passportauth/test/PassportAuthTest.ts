import * as express from 'express';
import * as sinon from 'sinon';
import PassportAuth from '../src/auth/PassportAuth';
import UserSecService from '../src/user/UserSec';
import MockUserApi from './mocks/MockUserApi';

describe('Test Passport Auth', function() {
  const userSec = new UserSecService(MockUserApi);
  const loginRoute = '/login';
  let testSubject: PassportAuth;
  let mockReq: any;
  let mockRes: any;
  let mockNext: any;

  beforeEach(function(done) {
    testSubject = new PassportAuth(userSec);
    mockReq = {};
    mockRes = {
      status: sinon.stub().returns({
        send: sinon.spy()
      }),
      json: sinon.spy(),
      redirect: sinon.spy()
    };
    mockNext = sinon.spy();
    done();
  });

  it('should redirect to the login route if user was not authenticated', function(done) {
    mockReq = {
      isAuthenticated: sinon.stub().returns(false),
      session: {
        returnTo: null
      },
      url: 'testUrlToReturnTo'
    };
    testSubject.protect()(mockReq as express.Request, mockRes as express.Response, mockNext);

    sinon.assert.notCalled(mockNext);
    sinon.assert.calledOnce(mockRes.redirect);
    sinon.assert.calledOnce(mockReq.isAuthenticated);
    sinon.assert.calledWith(mockRes.redirect, loginRoute);
    sinon.match.has(mockReq.session.returnTo, mockReq.url);

    done();
  });

  it('should call next if user was authenticated and route was not protected by a role', function(done) {
    mockReq = {
      isAuthenticated: sinon.stub().returns(true)
    };
    testSubject.protect()(mockReq as express.Request, mockRes as express.Response, mockNext);

    sinon.assert.calledOnce(mockNext);
    sinon.assert.notCalled(mockRes.redirect);
    sinon.assert.notCalled(mockRes.status);

    done();
  });

  it('should return a 401 if the authenticated user does not have the required role', function(done) {
    mockReq = {
      isAuthenticated: sinon.stub().returns(true)
    };
    testSubject.protect('testNoReqRole')(mockReq as express.Request, mockRes as express.Response, mockNext);

    setTimeout(() => {
      sinon.assert.notCalled(mockNext);
      sinon.assert.calledOnce(mockRes.status);
      sinon.assert.calledWith(mockRes.status, 401);

      done();
    }, 500);
  });

  it('should call next if the authenticated user has the required role', function(done) {
    mockReq = {
      isAuthenticated: sinon.stub().returns(true)
    };

    testSubject.protect('testReqRole')(mockReq as express.Request, mockRes as express.Response, mockNext);

    setTimeout(() => {
      sinon.assert.calledOnce(mockNext);
      sinon.assert.notCalled(mockRes.redirect);
      sinon.assert.notCalled(mockRes.status);

      done();
    }, 500);

  });
});
