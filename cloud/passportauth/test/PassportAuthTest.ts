import * as express from 'express';
import { SessionOptions } from 'express-session';
import * as sinon from 'sinon';
import PassportAuth from '../src/auth/PassportAuth';
import MockUserRepo, { mockUserObj, mockUserService } from './mocks/MockUserRepo';

describe('Test Passport Auth', function() {
  let router: express.Router;
  let mockSessionOpts: SessionOptions;
  let testSubject: PassportAuth;
  let mockReq: any;
  let mockRes: any;
  let mockNext: any;

  beforeEach(function() {
    testSubject = new PassportAuth(MockUserRepo, mockUserService);
    router = express.Router();
    mockSessionOpts = {
      secret: 'test',
      resave: false,
      saveUninitialized: true
    };
    mockReq = {};
    mockRes = {
      status: sinon.stub().returns({
        send: sinon.spy()
      }),
      json: sinon.spy(),
      redirect: sinon.spy(),
      end: sinon.spy()
    };
    mockNext = sinon.spy();
    testSubject.init(router, mockSessionOpts);
  });

  it('should return an error if an error occurred when retrieving the user', function(done) {
    mockReq = {
      headers: {},
      body: {
        username: 'testError',
        password: 'testError'
      },
      logIn: sinon.spy(),
      isAuthenticated: sinon.stub().returns(false),
      user: null
    };

    testSubject.authenticate('local')(mockReq as express.Request, mockRes as express.Response,
      mockNext as express.NextFunction);

    setImmediate(() => {
      sinon.assert.called(mockReq.isAuthenticated);
      sinon.assert.notCalled(mockReq.logIn);

      done();
    });
  });

  it('should not authenticate the user if the credentials provided are not valid', function(done) {
    mockReq = {
      headers: {},
      body: {
        username: 'invalidUsername',
        password: 'invalidPassword'
      },
      logIn: sinon.spy(),
      isAuthenticated: sinon.stub().returns(false),
      user: null
    };

    testSubject.authenticate('local')(mockReq as express.Request, mockRes as express.Response,
      mockNext as express.NextFunction);

    setImmediate(() => {
      sinon.assert.notCalled(mockReq.logIn);

      done();
    });
  });

  it('should authenticate the user if the credentials provided are valid', function(done) {
    mockReq = {
      headers: {},
      body: {
        username: 'testloginId',
        password: 'testPassword'
      },
      logIn: sinon.spy(),
      isAuthenticated: sinon.stub().returns(false),
      user: null
    };

    testSubject.authenticate('local', {
      successReturnToOrRedirect: '/',
      failureRedirect: '/loginError'
    })(mockReq as express.Request, mockRes as express.Response,
      mockNext as express.NextFunction);

    setImmediate(() => {
      sinon.assert.calledOnce(mockReq.logIn);

      done();
    });
  });

  it('should call next if the user is already authenticated and no redirect url is provided', function(done) {
    mockReq = {
      headers: {},
      body: {
        username: 'testloginId',
        password: 'testPassword'
      },
      session: {},
      logIn: sinon.spy(),
      isAuthenticated: sinon.stub().returns(true),
      user: null
    };

    testSubject.authenticate('local')(mockReq as express.Request, mockRes as express.Response,
      mockNext as express.NextFunction);

    setImmediate(() => {
      sinon.assert.calledOnce(mockNext);
      done();
    });
  });

  it('should send a status of 401 if the user was not authenticated', function() {
    mockReq = {
      isAuthenticated: sinon.stub().returns(false),
      headers: {
        referer: 'testUrlToReturnTo'
      },
      session: {}
    };
    testSubject.protect()(mockReq as express.Request, mockRes as express.Response, mockNext);

    sinon.assert.notCalled(mockNext);
    sinon.assert.calledOnce(mockRes.status);
    sinon.assert.calledOnce(mockReq.isAuthenticated);
    sinon.assert.calledWith(mockRes.status, 401);
  });

  it('should not assign a url to return to in session if session is not available', function() {
    mockReq = {
      isAuthenticated: sinon.stub().returns(false),
      session: {},
      headers: {
        referer: 'testUrlToReturnTo'
      }
    };
    testSubject.protect()(mockReq as express.Request, mockRes as express.Response, mockNext);

    sinon.assert.notCalled(mockNext);
    sinon.assert.calledOnce(mockRes.status);
    sinon.assert.calledOnce(mockReq.isAuthenticated);
    sinon.assert.calledWith(mockRes.status, 401);
    sinon.match.has(mockReq.session.returnTo, mockReq.headers.referer);
  });

  it('should assign a url to return to in session if referer is available', function() {
    mockReq = {
      isAuthenticated: sinon.stub().returns(false),
      headers: {
        referer: 'testUrlToReturnTo'
      }
    };
    testSubject.protect()(mockReq as express.Request, mockRes as express.Response, mockNext);

    sinon.assert.notCalled(mockNext);
    sinon.assert.calledOnce(mockRes.status);
    sinon.assert.calledOnce(mockReq.isAuthenticated);
    sinon.assert.calledWith(mockRes.status, 401);
    sinon.match(mockReq.session, undefined);
  });

  it('should assign a url to returnTo in session if originalUrl is available', function() {
    mockReq = {
      isAuthenticated: sinon.stub().returns(false),
      session: {},
      originalUrl: 'testUrlToReturnTo'
    };
    testSubject.protect()(mockReq as express.Request, mockRes as express.Response, mockNext);

    sinon.assert.notCalled(mockNext);
    sinon.assert.calledOnce(mockRes.status);
    sinon.assert.calledOnce(mockReq.isAuthenticated);
    sinon.assert.calledWith(mockRes.status, 401);
    sinon.match.has(mockReq.session.returnTo, mockReq.originalUrl);
  });

  it('should call next if the user was authenticated and the route was not protected by a role', function() {
    mockReq = {
      isAuthenticated: sinon.stub().returns(true),
      user: mockUserObj
    };
    testSubject.protect()(mockReq as express.Request, mockRes as express.Response, mockNext);

    sinon.assert.calledOnce(mockNext);
    sinon.assert.notCalled(mockRes.redirect);
    sinon.assert.notCalled(mockRes.status);
  });

  it('should return a 403 if the authenticated user does not have the required role', function(done) {
    mockReq = {
      isAuthenticated: sinon.stub().returns(true),
      user: mockUserObj
    };
    testSubject.protect('testNoReqRole')(mockReq as express.Request, mockRes as express.Response, mockNext);

    setImmediate(() => {
      sinon.assert.notCalled(mockNext);
      sinon.assert.calledOnce(mockRes.status);
      sinon.assert.calledWith(mockRes.status, 403);

      done();
    });
  });

  it('should call next if the authenticated user has the required role', function(done) {
    mockReq = {
      isAuthenticated: sinon.stub().returns(true),
      user: mockUserObj
    };

    testSubject.protect('testRole')(mockReq as express.Request, mockRes as express.Response, mockNext);

    setImmediate(() => {
      sinon.assert.calledOnce(mockNext);
      sinon.assert.notCalled(mockRes.redirect);
      sinon.assert.notCalled(mockRes.status);

      done();
    });
  });

  it('should not authenticate if the user is already authenticated', function(done) {
    mockReq = {
      headers: {},
      session: {
        clientURL: '/'
      },
      isAuthenticated: sinon.stub().returns(true),
      logIn: sinon.spy(),
      user: mockUserObj
    };

    testSubject.authenticate('/')(mockReq as express.Request, mockRes as express.Response,
      mockNext as express.NextFunction);

    setImmediate(() => {
      sinon.assert.calledOnce(mockReq.isAuthenticated);
      sinon.assert.calledOnce(mockRes.redirect);
      sinon.assert.calledWith(mockRes.redirect, mockReq.session.clientURL);
      sinon.assert.notCalled(mockReq.logIn);

      done();
    });
  });
});
