import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import {PassportAuth, PassportSetup, UserApiService, UserSecService} from '../src/index';
import {UserDataSource} from './UserDataSource';
import userSeedData, {User} from './UserSeedData';

const userSource = new UserDataSource<User>(userSeedData);
const userApi = new UserApiService<User>(userSource);
const userSec = new UserSecService<User>(userApi);
const passportSetup = new PassportSetup<User>(userSec);
const authService = new PassportAuth<User>(userSec);
const app = express();

app.use(bodyParser.json());
app.use(cors());
passportSetup.init(app); // initialize passport

app.get('/testSecureEndpoint', authService.protect('test', '/login'), (req: express.Request, res: express.Response) => {
  res.json({routeName: '/testSecureEndpoint', msg: 'secured route'});
});

app.get('/login', (req: express.Request, res: express.Response) => {
  res.json({routeName: '/login', msg: 'You need to login'});
});

app.post('/login', authService.login('local'), (req: express.Request, res: express.Response) => {
  res.json({routeName: '/login', msg: 'successfully logged in', user: req.user});
});

app.listen(3000, function() {
  console.log('Example auth app listening on port 3000');
});
