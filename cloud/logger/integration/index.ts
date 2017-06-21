// integration of logger
// npm run integration

// import
import {BunyanLogger} from '../src/BunyanLogger';

// constructor needs at least name
const log = new BunyanLogger({name: 'index'});
// by default debug logging is turned off to enable debug logging chang constructor to
// const log = new BunyanLogger({name: 'index', level: 'debug'});

let loggerObject: object = {logger: ''};

for ( let i = 0; i <= 4; i++) {
  log.info('' + i, loggerObject);
  if (i === 1) {
    loggerObject = {logger: 'debug'};
    log.debug('debug logger message\n', loggerObject);
  }
  if (i === 2) {
    loggerObject = {logger: 'error'};
    log.error('error logger message\n', loggerObject);
  }
  if (i === 3) {
    loggerObject = {logger: 'info'};
    log.info('info logger message\n', loggerObject);
  }
  if (i === 4) {
    loggerObject = {logger: 'warn'};
    log.warn('warn logger message\n', loggerObject);
  }
}
