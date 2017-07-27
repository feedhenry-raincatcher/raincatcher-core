import { PassportAuth, UserRepository, UserService } from '@raincatcher/auth-passport';
import * as express from 'express';
import sessionOpts from '../sessionOpts';

// Implementation for fetching and mapping user data
import DemoUserRepository, { SampleUserService } from './DemoUserRepository';

export function init(app: express.Express) {
  // Initialize user data repository and map current user
  const userRepo: UserRepository = new DemoUserRepository();
  const userService: UserService = new SampleUserService();
  const authService: PassportAuth = new PassportAuth(userRepo, userService);
  authService.init(app, sessionOpts);
  createRoutes(app, authService);
  return authService;
}

function createRoutes(router: express.Express, authService: PassportAuth) {
  router.get('/login', (req: express.Request, res: express.Response) => {
    if (req.session) {
      req.session.returnTo = req.headers.referer;
    }
    return res.render('login', {
      title: 'Feedhenry Workforce Management'
    });
  });

  router.post('/login', authService.authenticate('/', '/loginError'));

  router.get('/loginError', (req: express.Request, res: express.Response) => {
      return res.render('login', {
        title: 'Feedhenry Workforce Management',
        message: 'Invalid credentials'});
  });

  router.get('/profile', authService.protect(), (req: express.Request, res: express.Response) => {
    res.json(req.user);
  });

  router.get('/logout', (req: express.Request, res: express.Response) => {
    req.session.destroy(function(err) {
      res.status(200).send();
    });
  });
}
