import { CONSTANTS as PASSPORTCONSTANTS, PassportAuth, UserRepository, UserService } from '@raincatcher/auth-passport';
import { getLogger } from '@raincatcher/logger';
import * as express from 'express';
import { SessionOptions } from 'express-session';
import * as jwt from 'jsonwebtoken';
import * as logger from 'loglevel';
import appConfig from '../../util/Config';

// Implementation for fetching and mapping user data
import DemoUserRepository, { SampleUserService } from './DemoUserRepository';

const config = appConfig.getConfig();

export function init(router: express.Router, sessionOpts?: SessionOptions) {
  // Initialize user data repository and map current user
  const userRepo: UserRepository = new DemoUserRepository();
  const userService: UserService = new SampleUserService();
  const authService: PassportAuth = new PassportAuth(userRepo, userService);

  if (sessionOpts) {
    authService.init(router, sessionOpts);
    createPortalRoutes(router, authService, userRepo);
  } else {
    authService.init(router, sessionOpts, config.jwtSecret);
    createMobileRoutes(router, userRepo, userService);
  }
  return authService;
}

function createPortalRoutes(router: express.Router, authService: PassportAuth, userRepo: UserRepository) {
  getLogger().info('Creating Portal Routes');

  router.get('/login', (req: express.Request, res: express.Response) => {
    if (req.session) {
      req.session.returnTo = req.headers.referer;
    }

    return res.render('login', {
      title: config.portalLoginPage.title
    });
  });

  router.post('/login', authService.authenticate('local', {
    successReturnToOrRedirect: '/',
    failureRedirect: '/loginError'
  }));

  router.get('/loginError', (req: express.Request, res: express.Response) => {
    return res.render('login', {
      title: config.portalLoginPage.title,
      message: config.portalLoginPage.invalidMessage});
  });

  router.get('/user/profile', authService.protect(), (req: express.Request, res: express.Response) => {
    if (req.session) {
      res.json(req.session.passport.user);
    }
  });

  router.get('/logout', (req: express.Request, res: express.Response) => {
    if (req.session) {
      return req.session.destroy(function(err) {
        if (err) {
          getLogger().error(err);
          return res.status(500).end();
        }
        return res.status(200).end();
      });
    }
    getLogger().warn('No session found on GET /logout, responding with HTTP status 200');
    return res.status(200).end();
  });
}

function createMobileRoutes(router: express.Router, userRepo: UserRepository, userService: UserService) {
  getLogger().info('Creating Mobile Routes');
  router.post('/token', function(req, res, next) {
    if (req.body && req.body.username && req.body.password) {
      const callback = (err?: Error, user?: any) => {
        if (user && userService.validatePassword(user, req.body.password)) {
          const payload = user;
          const secret = config.jwtSecret || PASSPORTCONSTANTS.defaultSecret;
          const token = jwt.sign(payload, secret);
          return res.status(200).json({'token': token, 'profile': user });
        }

        return res.status(401).send();
      };
      userRepo.getUserByLogin(req.body.username, callback);
    }
  });
}
