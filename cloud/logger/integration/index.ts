
import {BunyanLogger, Logger} from '../src/index';

// constructor accept bunyan options. Please refer to https://www.npmjs.com/package/bunyan
const log: Logger = new BunyanLogger({name: 'index'});
// by default debug logging is turned off to enable debug logging change constructor to
// const log = new BunyanLogger({name: 'index', level: 'debug'});

log.debug('debug logger message\n', {testObject: 'debug'}, {anything: 'anything'});
log.error('error logger message\n', {testObject: 'error'});
log.info('info logger message\n', {testObject: 'info'});
log.warn('warn logger message\n', {testObject: 'warn'});
