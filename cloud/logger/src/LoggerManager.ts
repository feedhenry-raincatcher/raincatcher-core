import { Logger } from './Logger';

export let logger: Logger = new Logger();
// method to set the global logger
export function setLogger(defaultLogger: Logger) {
    this.logger = defaultLogger;
}
