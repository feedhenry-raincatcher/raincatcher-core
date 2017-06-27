import * as express from 'express';
import {SessionOptions} from 'express-session';
import * as sinon from 'sinon';
import PassportSetup from '../src/auth/PassportSetup';
import passport from '../src/index';
import UserSecService from '../src/user/UserSec';
import MockUserApi from './mocks/MockUserApi';

describe('Test Passport Setup', function() {
  const userSec = new UserSecService(MockUserApi);
  let testSubject: PassportSetup;
  let app: express.Express;
  let mockSessionOpts: SessionOptions;
  let mockReq: any;
  let mockRes: any;
  let mockNext: any;

  beforeEach(function(done) {
    testSubject = new PassportSetup(userSec);
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
    done();
  });

  it('should initialize passport', function(done) {
    testSubject.init(app, mockSessionOpts);
    done();
  });

  it('should authenticate the user using the local strategy', function(done) {
    mockReq = {
      body: {
        username: 'test',
        password: 'testPassword'
      },
      logIn: sinon.spy(),
      user: null
    };

    passport.authenticate('local')(mockReq as express.Request, mockRes as express.Response,
      mockNext as express.NextFunction);

    done();
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

    passport.authenticate('local')(mockReq as express.Request, mockRes as express.Response,
      mockNext as express.NextFunction);

    done();
  });

  it('should return an error if an error occurred when retrieving the user id', function(done) {
    mockReq = {
      body: {
        username: 'testError',
        password: 'invalidPassword'
      },
      logIn: sinon.spy(),
      user: null
    };

    passport.authenticate('local')(mockReq as express.Request, mockRes as express.Response,
      mockNext as express.NextFunction);

    done();
  });

});
