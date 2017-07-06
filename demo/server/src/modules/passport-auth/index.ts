import passport, { PassportAuth, UserRepository, UserSecurityService } from '@raincatcher/auth-passport';
import * as express from 'express';

// Implementation for fetching and mapping user data
import DemoUserRepository from './DemoUserRepository';

// Configuration for express session options
const sessionOpts = {
  secret: process.env.SESSION_SECRET || 'raincatcher',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    path: '/'
  }
};

export function init(app: express.Express) {
  // Initialize user data repository and map current user
  const userRepo = new DemoUserRepository();
  // Create default security service (or extend it)
  const userSec = new UserSecurityService(userRepo);
  const authService: PassportAuth = new PassportAuth(userSec);
  authService.init(app, sessionOpts);
  createRoutes(app, authService);
  return authService;
}

function createRoutes(router: express.Express, auth: PassportAuth) {
  router.get('/login', (req: express.Request, res: express.Response) => {
    res.render('login', {
      title: 'Feedhenry Workforce Management'
    });
  });

  router.post('/login', auth.authenticate('/'));

  router.get('/loginError', (req: express.Request, res: express.Response) => {
      return res.render('login', {
        title: 'Feedhenry Workforce Management',
        message: 'Invalid credentials'});
  });


}
