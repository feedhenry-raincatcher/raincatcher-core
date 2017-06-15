import {Result} from './index';

/**
 * Represents a Result that can be represented via a boolean value
 * i.e. pass/fail, approval/rejection, etc.
 */
export default class BooleanResult implements Result {
  public type: 'BooleanResult';
  /**
   * Convenience object parsed by url.parse
   */
  constructor(public value: boolean) {
  }
}
