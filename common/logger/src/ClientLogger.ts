import * as logger from 'loglevel';
import { Logger } from './Logger';

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
