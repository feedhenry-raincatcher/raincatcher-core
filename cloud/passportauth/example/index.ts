import { logger } from '@raincatcher/logger';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as path from 'path';
import passport, { PassportAuth, UserRepository, UserSecurityService } from '../src/index';

// Implementation for fetching and mapping user data
import ExampleUserDataRepository from './UserRepository';

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

// Initialize user data repository and map current user
const userRepo = new ExampleUserDataRepository();
// Create default security service (or extend it)
const userSec = new UserSecurityService(userRepo);
const authService: PassportAuth = new PassportAuth(userSec);

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cors());
authService.init(app, sessionOpts);

app.get('/testAdminEndpoint', authService.protect('admin'), (req: express.Request, res: express.Response) => {
  res.json({ routeName: '/testAdminEndpoint', msg: 'authorized to access admin endpoint' });
});

app.get('/testUserEndpoint', authService.protect('user'), (req: express.Request, res: express.Response) => {
  res.json({ routeName: '/testUserEndpoint', msg: 'authorized to access user route' });
});

app.get('/', (req: express.Request, res: express.Response) => {
  const payload = { msg: 'default route' };
  res.json(payload);
});

app.get('/testEndpoint', authService.protect(), (req: express.Request, res: express.Response) => {
  res.json({ routeName: '/testEndpoint', msg: 'user is authenticated, no role required for this resource' });
});

app.get('/login', (req: express.Request, res: express.Response) => {
  res.sendFile(path.join(__dirname, 'public/login.html'));
});

app.post('/login', authService.authenticate('/'));

app.use(function(err: any, req: express.Request, res: express.Response, next: any) {
  logger.error(err);
  res.status(500).send(err);
});

app.listen(3000, function() {
  logger.info('Example auth app listening on port 3000');
});
