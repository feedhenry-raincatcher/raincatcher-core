// integration of logger
// npm run integration

import {BunyanLogger, Logger} from '../src/index';

// constructor needs at least name
const log: Logger = new BunyanLogger({name: 'index'});
// by default debug logging is turned off to enable debug logging chang constructor to
// const log = new BunyanLogger({name: 'index', level: 'debug'});

log.debug('debug logger message\n', {logger: 'debug'});
log.error('error logger message\n', {logger: 'error'});
log.info('info logger message\n', {logger: 'info'});
log.warn('warn logger message\n', {logger: 'warn'});
