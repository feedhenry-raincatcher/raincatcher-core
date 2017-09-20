import * as chai from 'chai';
import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import * as sinon from 'sinon';
import PassportAuth from '../src/auth/PassportAuth';
import MockUserRepo, { mockUserObj, mockUserService } from './mocks/MockUserRepo';

const assert = chai.assert;

describe('Passport Token Based Authentication Tests', function() {
  let router: express.Router;
  let testSubject: PassportAuth;
  let mockReq: any;
  let mockRes: any;
  let mockNext: any;
  let mockSecret: string;

  beforeEach(function() {
    testSubject = new PassportAuth(MockUserRepo, mockUserService);
    router = express.Router();
    mockReq = {};
    mockRes = {
      status: sinon.stub().returns({
        send: sinon.spy(),
        json: sinon.spy()
      }),
      json: sinon.spy(),
      redirect: sinon.spy(),
      end: sinon.spy()
    };
    mockNext = sinon.spy();
    mockSecret = 'test_secret';
    testSubject.init(router, undefined, mockSecret);
  });

  it('should initialize passport with token based authentication', function(done) {
    testSubject.init(router, undefined, mockSecret);
    done();
  });

  it('should not initialize passport if secret is missing', function() {
    try {
      testSubject.init(router, undefined);
    } catch (error) {
      sinon.match.has('Missing JWT secret', 'Missing JWT secret');
    }
  });

  it('should generate and send a token if provided credentials are valid', function(done) {
    mockReq = {
      body: {
        username: 'testloginId',
        password: 'testPassword'
      }
    };

    testSubject.authenticateWithToken(mockSecret, mockUserService, MockUserRepo)
      (mockReq as express.Request, mockRes as express.Response, mockNext as express.NextFunction);

    setImmediate(() => {
      sinon.assert.calledWith(mockRes.status, 200);
      done();
    });
  });

  it('should not generate and send a token if provided credentials are invalid', function(done) {
    mockReq = {
      body: {
        username: 'invalidUsername',
        password: 'invalidPassword'
      }
    };

    testSubject.authenticateWithToken(mockSecret, mockUserService, MockUserRepo)
      (mockReq as express.Request, mockRes as express.Response, mockNext as express.NextFunction);

    setImmediate(() => {
      sinon.assert.calledWith(mockRes.status, 401);
      done();
    });
  });

  it('should return a 400 if request for token was invalid', function(done) {
    mockReq = {};

    testSubject.authenticateWithToken(mockSecret, mockUserService, MockUserRepo)
      (mockReq as express.Request, mockRes as express.Response, mockNext as express.NextFunction);

    setImmediate(() => {
      sinon.assert.calledWith(mockRes.status, 400);
      done();
    });
  });

  it('should return an error if an error occurred when retrieving the user', function(done) {
    const payload = 'testError';
    const token = jwt.sign(payload, mockSecret);
    mockReq = {
      headers: {
        authorization: 'JWT ' + token
      },
      body: {},
      logIn: sinon.spy(),
      isAuthenticated: sinon.stub().returns(false)
    };

    testSubject.authenticate('jwt')(mockReq as express.Request, mockRes as express.Response,
      mockNext as express.NextFunction);

    setImmediate(() => {
      const expectedErr = new Error('[TEST] Error retrieving user');
      sinon.assert.calledOnce(mockNext);
      // sinon.assert.calledWith(mockNext, expectedErr);
      done();
    });
  });

  it('should return a 401 if the credentials provided are not valid', function(done) {
    const payload = 'invalidUsername';
    const token = jwt.sign(payload, mockSecret);
    mockReq = {
      headers: {
        authorization: 'JWT ' + token
      },
      body: {},
      logIn: sinon.spy(),
      isAuthenticated: sinon.stub().returns(false)
    };

    testSubject.authenticate('jwt')(mockReq as express.Request, mockRes as express.Response,
      mockNext as express.NextFunction);

    setImmediate(() => {
      sinon.match.has(mockRes.statusCode.toString(), 401);
      sinon.assert.calledOnce(mockRes.end);
      sinon.assert.calledWith(mockRes.end, 'Unauthorized');
      done();
    });
  });

  it('should return a success if the token provided is valid', function(done) {
    const payload = 'testloginId';
    const token = jwt.sign(payload, mockSecret);
    mockReq = {
      headers: {
        authorization: 'JWT ' + token
      },
      body: {},
      logIn: sinon.spy(),
      isAuthenticated: sinon.stub().returns(false)
    };

    testSubject.authenticate('jwt')(mockReq as express.Request, mockRes as express.Response,
      mockNext as express.NextFunction);

    setImmediate(() => {
      sinon.assert.calledOnce(mockReq.logIn);
      done();
    });
  });

  it('should return 401 if the token provided is not valid on a protected route', function(done) {
    mockReq = {
      headers: {
        authorization: 'JWT invalid_token'
      },
      body: {},
      logIn: sinon.spy(),
      isAuthenticated: sinon.stub().returns(false)
    };

    testSubject.protect()(mockReq as express.Request, mockRes as express.Response,
      mockNext as express.NextFunction);

    setImmediate(() => {
      sinon.assert.calledWith(mockRes.status, 401);
      done();
    });
  });

  it('should return a 403 if the user does not have the required role', function(done) {
    const payload = 'testloginId';
    const token = jwt.sign(payload, mockSecret);
    mockReq = {
      headers: {
        authorization: 'JWT ' + token
      },
      body: {},
      logIn: sinon.spy(),
      isAuthenticated: sinon.stub().returns(false)
    };

    testSubject.protect('requiredRole')(mockReq as express.Request, mockRes as express.Response,
      mockNext as express.NextFunction);

    setImmediate(() => {
      sinon.assert.calledWith(mockRes.status, 403);
      done();
    });
  });

  it('should return a success if the provided token is valid and has the required role', function(done) {
    const payload = 'testloginId';
    const token = jwt.sign(payload, mockSecret);
    mockReq = {
      headers: {
        authorization: 'JWT ' + token
      },
      body: {},
      logIn: sinon.spy(),
      isAuthenticated: sinon.stub().returns(false)
    };

    testSubject.protect('testRole')(mockReq as express.Request, mockRes as express.Response,
      mockNext as express.NextFunction);

    setImmediate(() => {
      sinon.assert.calledOnce(mockNext);
      done();
    });
  });

  it('should return a success if the provided token is valid and the route is not protected with a role',
    function(done) {
    const payload = 'testloginId';
    const token = jwt.sign(payload, mockSecret);
    mockReq = {
      headers: {
        authorization: 'JWT ' + token
      },
      body: {},
      logIn: sinon.spy(),
      isAuthenticated: sinon.stub().returns(false)
    };

    testSubject.protect()(mockReq as express.Request, mockRes as express.Response,
      mockNext as express.NextFunction);

    setImmediate(() => {
      sinon.assert.calledOnce(mockNext);
      done();
    });
  });
});
