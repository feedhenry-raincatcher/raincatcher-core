import Logger from './Logger';
import * as bunyan from 'bunyan';

export class BunyanLogger implements Logger{
    logger:bunyan;

    constructor(options: bunyan.LoggerOptions){
        this.logger = bunyan.createLogger(options)
    }

    debug(message: string, object: any): void {
        this.logger.debug(message,object);
    }

    error(message: string, object: any): void {
        this.logger.error(message,object);
    }


    info(message: string, object: any): void {
      this.logger.info(message,object);
    }

    warn(message: string, object: any): void {
      this.logger.warn(message,object);
    }
}

export default BunyanLogger;
