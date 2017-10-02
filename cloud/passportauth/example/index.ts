import { BunyanLogger, getLogger, Logger, setLogger } from '@raincatcher/logger';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as path from 'path';
import { PassportAuth, UserRepository, UserService } from '../src/index';

// Implementation for fetching and mapping user data
import ExampleUserDataRepository, { SampleUserService } from './UserRepository';

// Setting logger
setLogger(new BunyanLogger({name: 'Passport Auth Module Example', level: 'debug'}));

// Configuration for express session options
const sessionOpts = {
  secret: process.env.SESSION_SECRET || 'raincatcher',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    path: '/'
  }
};

// Initialize user data repository and user service
const userRepo: UserRepository = new ExampleUserDataRepository();
const userService: UserService = new SampleUserService();
const sessionAuthService: PassportAuth = new PassportAuth(userRepo, userService);
const tokenAuthService: PassportAuth = new PassportAuth(userRepo, userService);

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cors());

app.get('/', (req: express.Request, res: express.Response) => {
  res.json({ name: 'Passport Auth Module Example' });
});

// Setting up authService using session based authentication
const sessionRouter = express.Router();
sessionAuthService.init(sessionRouter, sessionOpts);

// Setup routes to be used for session based authentication
sessionRouter.get('/session-login', (req: express.Request, res: express.Response) => {
  res.sendFile(path.join(__dirname, 'public/session-login.html'));
});

sessionRouter.post('/session-login', sessionAuthService.authenticate('local', {
  successReturnToOrRedirect: '/testSessionEndpoint'
}));

sessionRouter.get('/testSessionAdminEndpoint', sessionAuthService.protect('admin'),
  (req: express.Request, res: express.Response) => {
  res.json({ routeName: '/testSessionAdminEndpoint', authType: 'session', msg: 'authorized to access admin endpoint' });
});

sessionRouter.get('/testSessionUserEndpoint', sessionAuthService.protect('user'),
  (req: express.Request, res: express.Response) => {
  res.json({ routeName: '/testSessionUserEndpoint', authType: 'session', msg: 'authorized to access user endpoint'});
});

sessionRouter.get('/testSessionEndpoint', sessionAuthService.protect(),
  (req: express.Request, res: express.Response) => {
  res.json({ routeName: '/testSessionEndpoint', authType: 'session',
             msg: 'authorize to access endpoint, no roles required'});
});

sessionRouter.get('/logout', (req: express.Request, res: express.Response) => {
  req.logout();
  res.redirect('/');
});

// Setting up authService using token based authentication
const tokenRouter = express.Router();
const secret = 'demo_secret';
tokenAuthService.init(tokenRouter, undefined, secret);

// Setup routes to be used for token based authentication
tokenRouter.get('/token-login', (req: express.Request, res: express.Response) => {
  res.sendFile(path.join(__dirname, 'public/token-login.html'));
});

tokenRouter.post('/token-login', tokenAuthService.authenticateWithToken(secret, userService, userRepo));

tokenRouter.get('/testTokenAdminEndpoint', tokenAuthService.protect('admin'),
  (req: express.Request, res: express.Response) => {
  res.json({ routeName: '/testTokenAdminEndpoint', authType: 'token', msg: 'authorized to access admin endpoint'});
});

tokenRouter.get('/testTokenUserEndpoint', tokenAuthService.protect('user'),
  (req: express.Request, res: express.Response) => {
  res.json({ routeName: '/testTokenUserEndpoint', authType: 'token', msg: 'authorized to access user endpoint'});
});

tokenRouter.get('/testTokenEndpoint', tokenAuthService.protect(),
  (req: express.Request, res: express.Response) => {
    res.json({ routeName: '/testTokenEndpoint', authType: 'token',
               msg: 'authorized to access endpoint, no roles required'});
});

// Mount routers
app.use(sessionRouter);
app.use(tokenRouter);

app.use(function(err: any, req: express.Request, res: express.Response, next: any) {
  getLogger().error(err);
  res.status(500).send(err);
});

app.listen(3000, function() {
  getLogger().info('Example auth app listening on port 3000');
});
