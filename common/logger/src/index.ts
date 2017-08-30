import { BunyanLogger } from './BunyanLogger';
import { ClientLogger } from './ClientLogger';
import { EmptyLogger, Logger } from './Logger';

export { Logger } from './Logger';
export { BunyanLogger } from './BunyanLogger';
export { ClientLogger } from './ClientLogger';

let logger: Logger = new EmptyLogger();

/**
 * Set global logger to be used by all RainCatcher modules
 */
function setLogger(userLogger: Logger) {
  logger = userLogger;
}

/**
 * Get global logger implementation.
 *
 * @see setLogger - to setup your logger first
 */
function getLogger() {
  return logger;
}

export { getLogger, setLogger };
