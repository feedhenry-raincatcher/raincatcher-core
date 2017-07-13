
import { BunyanLogger, ConsoleLogger, getLogger, logger, Logger, setLogger} from '../src/index';

let log: Logger = logger;

// default logger won't return anything'
log.info('This should not render', { orthis: 'will not return' });
log.error('This should not render', { orthis: 'will not return' });
log.info('This should not render', { orthis: 'will not return' });
log.info('This should not render', { orthis: 'will not return' });

// you can instantiate the default logger with any Logger implementation to change the global logger

log = new ConsoleLogger();
setLogger(log);
log = getLogger();

log.info('This log will render with ConsoleLogger');

// you can over ride the global logger at any time
// constructor accept bunyan options. Please refer to https://www.npmjs.com/package/bunyan
// by default debug logging is turned off to enable debug logging change constructor to
// const log = new BunyanLogger({name: 'index', level: 'debug'});
log = new BunyanLogger({name: 'index', level: 'trace'});

log.debug('debug logger message\n', {testObject: 'debug'}, {anything: 'anything'});
log.error('error logger message\n', {testObject: 'error'});
log.info('info logger message\n', {testObject: 'info'});
log.warn('warn logger message\n', {testObject: 'warn'});

// constructor for console for use with client
log = new ConsoleLogger();

log.debug('something', {testObject: 300});
log.error('something', {testObject: 300});
log.info('something', {testObject: 300});
log.warn('something', {testObject: 300});
