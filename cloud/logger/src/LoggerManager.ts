import { EmptyLogger } from './EmptyLogger';
import { Logger } from './Logger';

// default logger is initialised to empty
//export let logger: Logger = new EmptyLogger();

export class LoggerManager {

  public logger: Logger = new EmptyLogger();
  // method to set the global logger
  public setLogger(defaultLogger: Logger): void {
    this.logger = defaultLogger;
  }

/*  // method to get the global logger
  public getLogger(): Logger {
    return logger;
  }*/
}

export default LoggerManager;
