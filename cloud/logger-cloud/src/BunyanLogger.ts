import Logger, {LOG_LEVEL} from './Logger';
import * as bunyan from 'bunyan';

export class BunyanLogger implements Logger{
    logger:bunyan;

    constructor(logLevel: LOG_LEVEL){
        const log = bunyan.createLogger({ name: '__filename', level:logLevel});
    }

    log(message: string, object: any): void {

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

