import { BunyanLogger, ConsoleLogger, Logger, logger, setLogger } from '../src/index';

// by default logger is turned off
logger.info('This should not render', { orthis: 'will not return' });
logger.error('This should not render', { orthis: 'will not return' });
logger.debug('This should not render', { orthis: 'will not return' });
logger.warn('This should not render', { orthis: 'will not return' });

// you can instantiate the default logger with any Logger implementation to change the global logger
const log = new BunyanLogger({name: 'index', level: 'trace'});

setLogger(log);
logger.info('This log will render with BunyanLogger');

// constructor accept bunyan options. Please refer to https://www.npmjs.com/package/bunyan

log.debug('debug logger message\n', {testObject: 'debug'}, {anything: 'anything'});
log.error('error logger message\n', {testObject: 'error'});
log.info('info logger message\n', {testObject: 'info'});
log.warn('warn logger message\n', {testObject: 'warn'});
