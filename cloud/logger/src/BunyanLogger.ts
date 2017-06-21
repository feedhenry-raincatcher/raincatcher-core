import * as bunyan from 'bunyan';
import Logger from './Logger';

export class BunyanLogger implements Logger {
    public logger: bunyan;

    constructor(options: bunyan.LoggerOptions) {
        this.logger = bunyan.createLogger(options);
    }

    public debug(message: string, object: any): void {
        this.logger.debug(message, object);
    }

    public error(message: string, object: any): void {
        this.logger.error(message, object);
    }

    public info(message: string, object: any): void {
      this.logger.info(message, object);
    }

    public warn(message: string, object: any): void {
      this.logger.warn(message, object);
    }
}

export default BunyanLogger;
