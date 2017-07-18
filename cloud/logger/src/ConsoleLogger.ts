import * as logger from 'loglevel';
import { Logger } from './Logger';

export class ConsoleLogger implements Logger {

  constructor(level: LogLevel = LogLevel.WARN) {
    logger.setLevel(level);
  }

  public debug(format: any, ...params: any[]): void {
    logger.info(format, params);
  }

  public error(format: any, ...params: any[]): void {
    logger.error(format, params);
  }

  public info(format: any, ...params: any[]): void {
    logger.info(format, params);
  }

  public warn(format: any, ...params: any[]): void {
    logger.warn(format, params);
  }

}
