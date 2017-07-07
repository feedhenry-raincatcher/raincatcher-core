import { ConsoleLogger, Logger } from '@raincatcher/logger';

const log: Logger = new ConsoleLogger();
/**
 * Represents the output of a {@link Task}
 * Implementations are expected to be accompanied by a front end component to render it
 */
export interface Result {
  /**
   * The Type's name in order for it to be serializable and sent over the wire
   * from the cloud app to the front-end, where each implementation will have a different behavior
   */
  type: string;
}
