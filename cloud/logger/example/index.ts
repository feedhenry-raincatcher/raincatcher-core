
import { BunyanLogger, ConsoleLogger, GetSetLogger, logger, Logger } from '../src/index';

let log: Logger = logger;

// by default logger is turned off
log.info('This should not render', { orthis: 'will not return' });
log.error('This should not render', { orthis: 'will not return' });
log.debug('This should not render', { orthis: 'will not return' });
log.warn('This should not render', { orthis: 'will not return' });

// you can instantiate the default logger with any Logger implementation to change the global logger

log = new ConsoleLogger();
const getSetLogger = new GetSetLogger();
getSetLogger.setLogger(log);
log = getSetLogger.getLogger();

log.info('This log will render with ConsoleLogger');

// constructor accept bunyan options. Please refer to https://www.npmjs.com/package/bunyan
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
