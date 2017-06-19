

export interface Logger {
    //log(message:string, object:any): void;
    debug(message:string, object:any): void;
    error(message:string, object:any): void;
    info(message:string, object:any): void;
    warn(message:string, object:any): void;
}

export default Logger;
