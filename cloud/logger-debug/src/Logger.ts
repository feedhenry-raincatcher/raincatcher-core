interface Logger {
  debug(message: string, data?: any, source?: string, tags?: string[]): void;
  error(message: string, data?: any, source?: string, tags?: string[]): void;
  info(message: string, data?: any, source?: string, tags?: string[]): void;
  warn(message: string, data?: any, source?: string, tags?: string[]): void;
}

export enum LOG_LEVEL {
  DEBUG,
  ERROR,
  INFO,
  WARN
}

export default Logger;
