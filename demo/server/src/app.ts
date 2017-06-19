'use strict';

import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as session from 'express-session';
import * as logger from 'morgan';
import * as path from 'path';
import * as favicon from 'serve-favicon';
import EnvironmentConfig, { CloudAppConfig, Config } from './util/config';

const app: express.Express = express();
const appConfig: Config<CloudAppConfig> = new EnvironmentConfig<CloudAppConfig>();
const config = appConfig.getConfig();

app.use(logger(config.morganOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret: 'test', resave: false, saveUninitialized: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')));

// app.use('/', index);

app.use((req: express.Request, res: express.Response, next) => {
  const err: any = new Error('Not Found');
  err.status = 404;
  next(err);
});

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
