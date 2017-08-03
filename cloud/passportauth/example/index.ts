import { getLogger } from '@raincatcher/logger';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as path from 'path';
import { PassportAuth, UserRepository, UserService } from '../src/index';

// Implementation for fetching and mapping user data
import ExampleUserDataRepository, { SampleUserService } from './UserRepository';

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
const authService: PassportAuth = new PassportAuth(userRepo, userService);

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
  const payload = { msg: 'default route', user: req.user, session: req.session};
  res.json(payload);
});

app.get('/testEndpoint', authService.protect(), (req: express.Request, res: express.Response) => {
  res.json({ routeName: '/testEndpoint', msg: 'user is authenticated, no role required for this resource' });
});

app.get('/login', (req: express.Request, res: express.Response) => {
  res.sendFile(path.join(__dirname, 'public/login.html'));
});

app.post('/login', authService.authenticate('/'));

app.get('/logout', (req: express.Request, res: express.Response) => {
  req.logout();
  res.redirect('/');
});

app.use(function(err: any, req: express.Request, res: express.Response, next: any) {
  getLogger().error(err);
  res.status(500).send(err);
});

app.listen(3000, function() {
  getLogger().info('Example auth app listening on port 3000');
});
