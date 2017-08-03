// npm run example
import { BunyanLogger, ClientLogger, Logger, logger, setLogger } from '../src/index';

// you can instantiate the default logger with any Logger implementation to change the global logger
const log = new BunyanLogger({ name: 'index', level: 'debug' });

// Bunyan logger
setLogger(log);
logger.info('This log will render with BunyanLogger');
logger.debug('debug logger message');
logger.error('error logger message', { customField: 1 });

// change the logger to console
setLogger(new ClientLogger(LogLevel.INFO));
logger.info('ClientLogger info level');
logger.info('ClientLogger info level ', { customField: 1 });
