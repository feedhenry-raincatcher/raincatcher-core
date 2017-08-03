import { BunyanLogger } from './BunyanLogger';
import { ClientLogger } from './ClientLogger';
import { EmptyLogger, Logger } from './Logger';

export { Logger } from './Logger';
export { BunyanLogger } from './BunyanLogger';
export { ClientLogger } from './ClientLogger';

let logger: Logger = new EmptyLogger();

function setLogger(userLogger: Logger) {
  logger = userLogger;
}

export { logger, setLogger };
