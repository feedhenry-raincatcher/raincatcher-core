import { BunyanLogger, ConsoleLogger, Logger, logger, setLogger } from '../src/index';

// by default logger is turned off
logger.info('This should not render', { orthis: 'will not return' });
logger.error('This should not render', { orthis: 'will not return' });
logger.debug('This should not render', { orthis: 'will not return' });
logger.warn('This should not render', { orthis: 'will not return' });

// you can instantiate the default logger with any Logger implementation to change the global logger
let log = new ConsoleLogger();

setLogger(log);
logger.info(logger);
logger.info('This log will render with ConsoleLogger');

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

