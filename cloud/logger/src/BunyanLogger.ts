import * as bunyan from 'bunyan';
import Logger from './Logger';

export class BunyanLogger implements Logger {
  public logger: bunyan;

  constructor(options: bunyan.LoggerOptions) {
    this.logger = bunyan.createLogger(options);
  }

  public debug(format: any, ...params: any[]): void {
    if(params.length) {
      return this.logger.debug(format, params);
    }
    this.logger.debug(format);
  }

  public error(format: any, ...params: any[]): void {
    if(params.length) {
      return this.logger.error(format, params);
    }
    this.logger.error(format);
  }

  public info(format: any, ...params: any[]): void {
    if(params.length) {
      return this.logger.info(format, params);
    }
    this.logger.info(format);
  }

  public warn(format: any, ...params: any[]): void {
    if(params.length) {
      return this.logger.warn(format, params);
    }
    this.logger.warn(format);
  }
}

export default BunyanLogger;
