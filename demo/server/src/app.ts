'use strict';

import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as session from 'express-session';
import * as path from 'path';
import * as logger from 'morgan';
import * as path from 'path';
import * as favicon from 'serve-favicon';
import EnvironmentConfig, { Config, CloudAppConfig } from './util/config';
import * as passport from 'passport';
import {Strategy} from 'passport-local';
import users, {User} from './userSeed';

const app: express.Express = express();
const appConfig: Config<CloudAppConfig> = new EnvironmentConfig<CloudAppConfig>();
const config = appConfig.getConfig();

app.use(logger(config.morganOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret: 'test', resave: false, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')));

app.use('/', index);

app.use((req: express.Request, res: express.Response, next) => {
  const err: any = new Error('Not Found');
  err.status = 404;
  next(err);
});

//passport config
passport.serializeUser((user: User, done) => {
  done(null, user.id);
});

passport.deserializeUser((id: string, done) => {
  users.forEach(function(user) {
    if(user.id === id) {
      let userObj = {
        username: user.username,
        name: user.name,
        position: user.position,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        banner: user.banner,
        notes: user.notes

      };
      done(null, userObj);
    }
  });
});


//Configure passport strategy using passport-local strategy
//Use userSeed as data
passport.use(new Strategy(function(username, password, done) {
  let userIndex = users.map(function(user) {return user.username}).indexOf(username);

  if(users[userIndex] && users[userIndex].password === password) {
    return done(null, users[userIndex]);
  } else {
    return done(null, false);
  }
}));

let errHandler: express.ErrorRequestHandler;

errHandler = (err: any, req: express.Request, res: express.Response, next: () => void) => {
  res.status(err.status || 500);
  res.render('error', {
    title: 'error',
    message: err.message,
    error: config.logStackTraces ? err : {}
  });
};

app.use(errHandler);
export default app;
