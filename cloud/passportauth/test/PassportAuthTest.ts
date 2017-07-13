import { BunyanLogger, Logger } from '@raincatcher/logger';
import * as express from 'express';
import { SessionOptions } from 'express-session';
import * as sinon from 'sinon';
import PassportAuth from '../src/auth/PassportAuth';
import UserSecService from '../src/user/UserSecurityService';
import MockUserRepo from './mocks/MockUserRepo';

describe('Test Passport Auth', function() {
  const userSec = new UserSecService(MockUserRepo);
  const log: Logger = new BunyanLogger({name: 'PassportAuthTest', level: 'error'});
  const loginRoute = '/login';
  let app: express.Express;
  let mockSessionOpts: SessionOptions;
  let testSubject: PassportAuth;
  let mockReq: any;
  let mockRes: any;
  let mockNext: any;

  beforeEach(function() {
    testSubject = new PassportAuth(userSec, log);
    app = express();
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
  });

  it('should initialize passport', function() {
    testSubject.init(app, mockSessionOpts);
  });

  it('should return an error if an error occurred when retrieving the user id', function(done) {
    mockReq = {
      body: {
        username: 'testError',
        password: 'testError'
      },
      logIn: sinon.spy(),
      user: null
    };

    testSubject.authenticate('/')(mockReq as express.Request, mockRes as express.Response,
      mockNext as express.NextFunction);

    setImmediate(() => {
      sinon.assert.notCalled(mockReq.logIn);

      done();
    });
  });

  it('should not authenticate the user if the credentials provided are not valid', function(done) {
    mockReq = {
      body: {
        username: 'invalidUsername',
        password: 'invalidPassword'
      },
      logIn: sinon.spy(),
      user: null
    };

    testSubject.authenticate('/')(mockReq as express.Request, mockRes as express.Response,
      mockNext as express.NextFunction);

    setImmediate(() => {
      sinon.assert.notCalled(mockReq.logIn);

      done();
    });
  });

  it('should authenticate the user if the credentials provided are valid', function(done) {
    mockReq = {
      body: {
        username: 'testloginId',
        password: 'testPasswordHash'
      },
      logIn: sinon.spy(),
      user: null
    };

    testSubject.authenticate('/')(mockReq as express.Request, mockRes as express.Response,
      mockNext as express.NextFunction);

    setImmediate(() => {
      sinon.assert.calledOnce(mockReq.logIn);

      done();
    });
  });

  it('should redirect to the login route if user was not authenticated', function() {
    mockReq = {
      isAuthenticated: sinon.stub().returns(false),
      originalUrl: 'testUrlToReturnTo'
    };
    testSubject.protect()(mockReq as express.Request, mockRes as express.Response, mockNext);

    sinon.assert.notCalled(mockNext);
    sinon.assert.calledOnce(mockRes.redirect);
    sinon.assert.calledOnce(mockReq.isAuthenticated);
    sinon.assert.calledWith(mockRes.redirect, loginRoute);
  });

  it('should assign a url to return to in session if session was defined', function() {
    mockReq = {
      isAuthenticated: sinon.stub().returns(false),
      session: {},
      originalUrl: 'testUrlToReturnTo'
    };
    testSubject.protect()(mockReq as express.Request, mockRes as express.Response, mockNext);

    sinon.assert.notCalled(mockNext);
    sinon.assert.calledOnce(mockRes.redirect);
    sinon.assert.calledOnce(mockReq.isAuthenticated);
    sinon.assert.calledWith(mockRes.redirect, loginRoute);
    sinon.match.has(mockReq.session.returnTo, mockReq.url);
  });

  it('should call next if the user was authenticated and the route was not protected by a role', function() {
    mockReq = {
      isAuthenticated: sinon.stub().returns(true)
    };
    testSubject.protect()(mockReq as express.Request, mockRes as express.Response, mockNext);

    sinon.assert.calledOnce(mockNext);
    sinon.assert.notCalled(mockRes.redirect);
    sinon.assert.notCalled(mockRes.status);
  });

  it('should return a 403 if the authenticated user does not have the required role', function(done) {
    mockReq = {
      isAuthenticated: sinon.stub().returns(true)
    };
    testSubject.protect('testNoReqRole')(mockReq as express.Request, mockRes as express.Response, mockNext);

    setImmediate(() => {
      // Enable after implementing roles
      // sinon.assert.notCalled(mockNext);
      // sinon.assert.calledOnce(mockRes.status);
      // sinon.assert.calledWith(mockRes.status, 403);

      done();
    });
  });

  it('should call next if the authenticated user has the required role', function(done) {
    mockReq = {
      isAuthenticated: sinon.stub().returns(true)
    };

    testSubject.protect('testReqRole')(mockReq as express.Request, mockRes as express.Response, mockNext);

    setImmediate(() => {
      sinon.assert.calledOnce(mockNext);
      sinon.assert.notCalled(mockRes.redirect);
      sinon.assert.notCalled(mockRes.status);

      done();
    });

  });
});
