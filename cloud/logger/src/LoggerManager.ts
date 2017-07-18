import { EmptyLogger } from './EmptyLogger';
import { Logger } from './Logger';

export let logger: Logger = new EmptyLogger();
// method to set the global logger
export function setLogger(defaultLogger: Logger) {
    this.logger = defaultLogger;
}
