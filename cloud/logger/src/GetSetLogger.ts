
import { logger } from './index';
import { Logger } from './Logger';

export class GetSetLogger {
  public logger: Logger = logger;

  // method to set the global logger
  public setLogger(defaultLogger: Logger): void {
    this.logger = defaultLogger;
  }

  // method to get the global logger
  public getLogger(): Logger {
    return this.logger;
  }
}

export default GetSetLogger;
