import * as debug from 'debug';
import Logger, {LOG_LEVEL} from './Logger';

/**
 * Raincatcher logger implementation, can take a different logger at construction time.
 */
export default class LoggerImpl implements Logger {

  public static getInstance(): LoggerImpl {
    return LoggerImpl.instance;
  }

  private static instance: LoggerImpl = new LoggerImpl();
  private namespace: string;
  private logger: any;

  constructor() {
    if (LoggerImpl.instance) {
      throw new Error('Error: Instantiation failed: Use LoggerImpl.getInstance() instead of new().');
    } else {
      LoggerImpl.instance = this;
    }
  }

  public setNamespace( namespace: string) {
    this.namespace = namespace;
    this.logger = debug(`${namespace}:error:`);
  }

  public debug(message: string): void {
    this.logger(`debug:${message}`);
  }

  public error(message: string): void {
    this.logger(`error:${message}`);
  }

  public info(message: string): void {
    this.logger(`info:${message}`);
  }

  public warn(message: string): void {
    this.logger(`warning:${message}`);
  }

  public log(level: LOG_LEVEL, message: string) {
    switch (+level) {
      case LOG_LEVEL.DEBUG:
        this.debug(message);
        break;
      case LOG_LEVEL.ERROR:
        this.error(message);
        break;
      case LOG_LEVEL.INFO:
        this.info(message);
        break;
      case LOG_LEVEL.WARN:
        this.warn(message);
        break;
      default:
    }
  }
}
