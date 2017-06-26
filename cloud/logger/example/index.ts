
import {BunyanLogger, ConsoleLogger, Logger} from '../src/index';

// constructor accept bunyan options. Please refer to https://www.npmjs.com/package/bunyan
// by default debug logging is turned off to enable debug logging change constructor to
// const log = new BunyanLogger({name: 'index', level: 'debug'});
const log: Logger = new BunyanLogger({name: 'index', level: 'trace'});

log.debug('debug logger message\n', {testObject: 'debug'}, {anything: 'anything'});
log.error('error logger message\n', {testObject: 'error'});
log.info('info logger message\n', {testObject: 'info'});
log.warn('warn logger message\n', {testObject: 'warn'});

// constructor for console for use with client
const con: Logger = new ConsoleLogger();

con.debug('something', {testObject: 300});
con.error('something', {testObject: 300});
con.info('something', {testObject: 300});
con.warn('something', {testObject: 300});
