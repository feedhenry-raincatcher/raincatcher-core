'use strict';

import * as express from 'express';
import * as path from 'path';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import index from './routes/index';
import * as favicon from 'serve-favicon';

const app: express.Express = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')))

app.use('/', index);

app.use((req: express.Request, res: express.Response, next) => {
  var err: any = new Error('Not Found');
  err.status = 404;
  next(err);
});

let errHandler: express.ErrorRequestHandler;

if (process.env.NODE_ENV === 'development') {
  //development error handler
  errHandler = (err: any, req: express.Request, res: express.Response, next: () => void) => {
    res.status(err.status || 500);
    res.render('error', {
      title: 'error',
      message: err.message,
      error: err
    });
  };
} else {
  errHandler = (err: any, req: express.Request, res: express.Response, next: () => void) => {
    res.status(err.status || 500);
    res.render('error', {
      title: 'error',
      message: err.message,
      error: {}
    });
  };
}
app.use(errHandler);

export default app;

