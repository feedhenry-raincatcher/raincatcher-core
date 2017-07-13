import {Logger} from './Logger';

export class EmptyLogger implements Logger {
  public debug(format: any, ...params: any[]): void {
    //
  }

  public error(format: any, ...params: any[]): void {
    //
  }

  public info(format: any, ...params: any[]): void {
    //
  }

  public warn(format: any, ...params: any[]): void {
    //
  }
}
