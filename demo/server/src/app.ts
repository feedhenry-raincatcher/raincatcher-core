'use strict';

import { getLogger } from '@raincatcher/logger';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as expressHbs from 'express-handlebars';
import * as morgan from 'morgan';
import * as path from 'path';
import * as favicon from 'serve-favicon';
import { securityMiddleware, setupModules } from './modules';
import index from './user-routes/index';
import appConfig from './util/Config';

const app: express.Express = express();
const config = appConfig.getConfig();

/**
 * Function for setting CORS configuration. When using Passport as an auth service,
 * the credentials must be set to true.By doing this, the origin cannot be set to
 * '*'. Origin needs to be set to allow all origins for enabling cross-domain requests.
 *
 * @returns CORS configuration
 */
function getCorsConfig() {
  let corsConfig = {};
  if (!config.keycloakConfig) {
    const dynamicOrigin = function(origin: any, callback: (err: Error | null, bool: boolean) => void) {
      callback(null, true);
    };
    corsConfig = {
      origin: dynamicOrigin,
      credentials: true
    };
  }
  return corsConfig;
}

if (config.morganOptions) {
  app.use(morgan(config.morganOptions));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')));
app.use(cors(getCorsConfig()));

app.engine('hbs', expressHbs());
app.set('view engine', 'hbs');

setupModules(app);
app.use('/', index);

app.use((req: express.Request, res: express.Response, next) => {
  const err: any = new Error('Not Found');
  err.status = 404;
  next(err);
});

let errHandler: express.ErrorRequestHandler;

errHandler = (err: any, req: express.Request, res: express.Response, next: () => void) => {
  res.status(err.status || 500);
  getLogger().error(err);
  const errorObj: any = {
    message: err.message,
    originalError: config.logStackTraces ? err.originalError : {}
  };
  if (err.code) {
    errorObj.code = err.code;
  } else {
    errorObj.code = 'UnexpectedError';
  }
  res.json(errorObj);
};

app.use(errHandler);
export default app;
