/**
 * Logging interface used in all RainCatcher modules
 * Clients can extend it to integrate with their own logging library.
 * Interface may be used on both server and client environments
 *
 * @see BunyanLogger - default server side logger
 * @see ClientLogger - default browser enabled logger
 */
export interface Logger {
  /**
   * Log on debug level
   * @param message - message to log
   * @param options - object to include in log
   */
  debug(message: string, options?: any): void;

  /**
   * Log on info level
   * @param message - message to log
   * @param options - object to include in log
   */
  info(message: string, options?: any): void;

  /**
   * Log on warn level
   * @param message - message to log
   * @param options - object to include in log
   */
  warn(message: string, options?: any): void;

  /**
   * Log on error level
   * @param message - message to log
   * @param options - object to include in log
   */
  error(message: string, options?: any): void;
}

/**
 * Empty logger implementation used by default to suppress logging
 */
export class EmptyLogger {
  public debug(message: string, options?: any): void {
    //
  }
  public error(message: string, options?: any): void {
    //
  }
  public info(message: string, options?: any): void {
    //
  }
  public warn(message: string, options?: any): void {
    //
  }
}

export default Logger;
