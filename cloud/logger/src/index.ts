import {BunyanLogger} from './BunyanLogger';
import {ConsoleLogger} from './ConsoleLogger';

export {Logger} from  './Logger';
export {BunyanLogger} from  './BunyanLogger';
export {ConsoleLogger} from './ConsoleLogger';


import {Logger} from  './Logger';

// Global logger that will be used in all applications
export let logger: Logger; 

/**
* Set default logger to be used by all modules
*/
export function setGlobalLogger(defaultLogger: Logger){
   logger = defaultLogger;
}

/**
* Retrieve default logger
*/
export function getGlobalLogger(location?:string): Logger{
   return logger;
}
