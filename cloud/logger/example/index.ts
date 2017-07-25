// npm run example
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

logger.debug('debug logger message\n', {testObject: 'debug'}, {anything: 'anything'});
logger.info('info logger message\n', {testObject: 'info'});
logger.warn('warn logger message\n', {testObject: 'warn'});
logger.error('error logger message\n', {testObject: 'error'});

// change the logger to console
setLogger(new ConsoleLogger());
logger.warn('=========================================================================================');
logger.info('info wont render as console default logger level set at warn');
logger.warn('logger is now set to Console logger and level is warn');
logger.warn('=========================================================================================');
// change the logLevel for console log to info
setLogger(new ConsoleLogger(LogLevel.INFO));
logger.info('console logger info level will now render');
logger.info('=========================================================================================');
