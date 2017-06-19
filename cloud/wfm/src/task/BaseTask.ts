import { EventEmitter } from 'eventemitter3';
import {Result} from '../result';
import { Task, TaskEventData, TaskStatus } from './index';

/**
 * Base implementation for {@link Task}s
 * Derived classes are expected to implement their run {@link #run} methods
 */
class BaseTask extends EventEmitter implements Task {
  public result: Result;
  /**
   * Storage field for the `status` property
   */
  protected _status: TaskStatus | number = TaskStatus.pending;
  protected options: object;

  /**
   * Setter for the status property
   * Emits a statusChange event when set
   */
  public set status(to: TaskStatus | number) {
    if (to === this._status) {
      return;
    }
    const previousStatus = this.getStatus();
    this._status = to;
    const currentStatus = this.getStatus();

    const e: TaskEventData<this> = {
      date: new Date(),
      previousStatus,
      currentStatus,
      task: this
    };
    this.emit('statusChange', e);
  }

  public get status() {
    return this._status;
  }

  /**
   * Start the execution.
   * This method is expected to be overridden in specific implementations
   *
   * This implementation simply sets the status to {@link TaskStatus#done}
   */
  public run() {
    this.status = TaskStatus.done;
  }

  public getOptionsSchema = () => ({});
  public setOptions(options: object) {
    // TODO: JsonSchema validation with http://epoberezkin.github.io/ajv/
    this.options = options;
  }

  public getStatus() {
    const roundedDownStatus = this.status - (this.status % 100);
    return roundedDownStatus || TaskStatus.pending;
  }
}

export default BaseTask;
