import {Result} from './index';

/**
 * Represents a {@link Result} that can be represented via a boolean value
 * i.e. pass/fail, approval/rejection, etc.
 */
export default class BooleanResult implements Result {
  public type: 'BooleanResult';
  constructor(public value: boolean) {
  }
}
