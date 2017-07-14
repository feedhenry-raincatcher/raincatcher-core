import { BunyanLogger } from './BunyanLogger';
import { ConsoleLogger } from './ConsoleLogger';
import { EmptyLogger } from './EmptyLogger';
import { GetSetLogger } from './GetSetLogger';
import { Logger } from './Logger';

export { Logger } from  './Logger';
export { BunyanLogger } from  './BunyanLogger';
export { ConsoleLogger } from './ConsoleLogger';
export { GetSetLogger } from './GetSetLogger';

// default logger is initialised to empty
export let logger: Logger = new EmptyLogger();

