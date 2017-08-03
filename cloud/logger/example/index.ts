// npm run example
import { BunyanLogger, ClientLogger, getLogger, Logger, setLogger } from '../src/index';

// In application
const log = new BunyanLogger({ name: 'index', level: 'debug' });
setLogger(log);

// In other module
const logger = getLogger();

logger.info('This log will render with BunyanLogger');
logger.debug('debug logger message');
logger.error('error logger message', { customField: 1 });

// change the logger to console
setLogger(new ClientLogger(LogLevel.INFO));
logger.info('ClientLogger info level');
logger.info('ClientLogger info level ', { customField: 1 });
