import * as bunyan from 'bunyan';
import Logger from './Logger';

/**
 * Default logger implementation for server side code using bunyan.
 * For more inmessageion about logging and setup please refer to bunyan documentation.
 */
export class BunyanLogger implements Logger {
  public logger: bunyan;

  constructor(options: bunyan.LoggerOptions) {
    this.logger = bunyan.createLogger(options);
  }

  public debug(message: string, options?: any): void {
    if (options) {
      this.logger.debug(options, message);
    } else {
      this.logger.debug(message);
    }
  }

  public error(message: string, options?: any): void {
    if (options) {
      this.logger.error(options, message);
    } else {
      this.logger.error(message);
    }
  }

  public info(message: string, options?: any): void {
    if (options) {
      this.logger.info(options, message);
    } else {
      this.logger.info(message);
    }
  }

  public warn(message: string, options?: any): void {
    if (options) {
      this.logger.warn(options, message);
    } else {
      this.logger.warn(message);
    }
  }
}
