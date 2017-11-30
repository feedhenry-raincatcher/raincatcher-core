/**
 * @module @raincatcher/logger
 */

import { Logger } from './Logger';
// tslint:disable-next-line:no-var-requires
const logger: any = require('loglevel');

// imported from https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/loglevel/index.d.ts#L9
// see https://issues.jboss.org/browse/RAINCATCH-1183 and https://issues.jboss.org/browse/RAINCATCH-1182 for reasons
export const enum LogLevel {
  TRACE = 0,
  DEBUG = 1,
  INFO = 2,
  WARN = 3,
  ERROR = 4,
  SILENT = 5
}

/**
 * Default client (browser) logger implementation using loglevel library
 *
 * @see Logger
 */
export class ClientLogger implements Logger {

  constructor(level: LogLevel = LogLevel.WARN) {
    logger.setLevel(level);
  }

  public debug(message: any, options?: any): void {
    if (options) {
      logger.info(message, options);
    } else {
      logger.info(message);
    }
  }

  public error(message: any, options?: any): void {
    if (options) {
      logger.error(message, options);
    } else {
      logger.error(message);
    }
  }

  public info(message: any, options?: any): void {
    if (options) {
      logger.info(message, options);
    } else {
      logger.info(message);
    }
  }

  public warn(message: any, options?: any): void {
    if (options) {
      logger.warn(message, options);
    } else {
      logger.warn(message);
    }
  }

}
