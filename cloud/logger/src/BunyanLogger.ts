import * as bunyan from 'bunyan';
import Logger from './Logger';

export class BunyanLogger implements Logger {
  public logger: bunyan;

  constructor(options: bunyan.LoggerOptions) {
    this.logger = bunyan.createLogger(options);
  }

  public debug(format: any, ...params: any[]): void {
    this.logger.debug(format, params);
  }

  public error(format: any, ...params: any[]): void {
    this.logger.error(format, params);
  }

  public info(format: any, ...params: any[]): void {
    this.logger.info(format, params);
  }

  public warn(format: any, ...params: any[]): void {
    this.logger.warn(format, params);
  }
}

export default BunyanLogger;
