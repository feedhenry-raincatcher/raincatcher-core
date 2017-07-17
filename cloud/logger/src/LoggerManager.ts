import { EmptyLogger } from './EmptyLogger';
import { Logger } from './Logger';

export class LoggerManager {

  public logger: Logger = new EmptyLogger();
  // method to set the global logger
  public setLogger(defaultLogger: Logger): void {
    this.logger = defaultLogger;
  }
}

export default LoggerManager;
