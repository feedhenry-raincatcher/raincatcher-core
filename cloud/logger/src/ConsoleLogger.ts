import {Logger} from './Logger';

export class ConsoleLogger implements Logger {
  public debug(format: any, ...params: any[]): void {
    console.info(format, params);
  }

  public error(format: any, ...params: any[]): void {
    console.error(format, params);
  }

  public info(format: any, ...params: any[]): void {
    console.info(format, params);
  }

  public warn(format: any, ...params: any[]): void {
    console.warn(format, params);
  }

}
