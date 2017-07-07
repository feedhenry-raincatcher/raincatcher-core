import { ConsoleLogger, Logger } from '@raincatcher/logger';
import {Result} from './Result';

const log: Logger = new ConsoleLogger();
/**
 * Represents a {@link Result} that can be represented via a boolean value
 * i.e. pass/fail, approval/rejection, etc.
 */
export class BooleanResult implements Result {
  public type = 'BooleanResult';
  constructor(public value: boolean) {
  }
}
