// integration of logger
// npm run integration

import {BunyanLogger, Logger} from '../src/index';

// constructor needs at least name
const log: Logger = new BunyanLogger({name: 'index'});
// by default debug logging is turned off to enable debug logging change constructor to
// const log = new BunyanLogger({name: 'index', level: 'debug'});

log.debug('debug logger message\n', {test: 'debug'}, {anything: 'anything'});
log.error('error logger message\n', {test: 'error'});
log.info('info logger message\n', {test: 'info'});
log.warn('warn logger message\n', {test: 'warn'});
