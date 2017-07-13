import {BunyanLogger} from './BunyanLogger';
import {ConsoleLogger} from './ConsoleLogger';
import {EmptyLogger} from './EmptyLogger';
import { Logger } from './Logger';

export {Logger} from  './Logger';
export {BunyanLogger} from  './BunyanLogger';
export {ConsoleLogger} from './ConsoleLogger';
export {EmptyLogger} from './EmptyLogger';

// default logger is initialised to empty
export let logger: Logger = new EmptyLogger();

// function to set the global logger
export function setLogger(defaultLogger: Logger) {
  logger = defaultLogger;
}

// function to get the global logger
export function getLogger(): Logger {
  return logger;
}
