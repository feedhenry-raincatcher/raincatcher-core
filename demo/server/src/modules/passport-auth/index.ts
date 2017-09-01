import { PassportAuth, UserRepository, UserService } from '@raincatcher/auth-passport';
import { getLogger } from '@raincatcher/logger';
import * as express from 'express';
import { SessionOptions } from 'express-session';
import * as jwt from 'jsonwebtoken';
import * as logger from 'loglevel';

// Implementation for fetching and mapping user data
import DemoUserRepository, { SampleUserService } from './DemoUserRepository';

export function init(app: express.Router, sessionOpts?: SessionOptions) {
  // Initialize user data repository and map current user
  const userRepo: UserRepository = new DemoUserRepository();
  const userService: UserService = new SampleUserService();
  const authService: PassportAuth = new PassportAuth(userRepo, userService);
  authService.init(app, sessionOpts);
  if (sessionOpts) {
      createPortalRoutes(app, authService, userRepo);
  } else {
    createMobileRoutes(app, authService, userRepo, userService);
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
      title: 'Portal Feedhenry Workforce Management'
    });
  });

  router.post('/login', authService.authenticate('local', '/', '/loginError'));

  router.get('/loginError', (req: express.Request, res: express.Response) => {
    return res.render('login', {
      title: 'Feedhenry Workforce Management',
      message: 'Invalid credentials'});
  });

  router.get('/profile', authService.protect(), (req: express.Request, res: express.Response) => {
    res.json(req.user);
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

function createMobileRoutes(router: express.Router, authService: PassportAuth,
                            userRepo: UserRepository, userService: UserService) {
  getLogger().info('Creating Mobile Routes');
  router.post('/token', function(req, res, next) {
    if (req.body && req.body.username && req.body.password) {
      const callback = (err?: Error, user?: any) => {
        if (user && userService.validatePassword(user, req.body.password)) {
          const payload = user;
          const token = jwt.sign(payload, 'secret');
          return res.status(200).json({'token': token, 'profile': user });
        }

        return res.status(401).send();
      };
      userRepo.getUserByLogin(req.body.username, callback);
    }
  });

  router.post('/login-mobile', authService.authenticate('jwt'), (req, res, next) => {
    res.status(200).send();
  });
}
