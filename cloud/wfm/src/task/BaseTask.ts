import { EventEmitter } from 'eventemitter3';
import { Task, TaskEventData, TaskStatus } from './index';

/**
 * Base implementation for
 */
class BaseTask extends EventEmitter implements Task {
  protected _status: TaskStatus | number = TaskStatus.pending;
  protected options: object;

  public set status(to: TaskStatus | number) {
    const e: TaskEventData<this> = {
      date: new Date(),
      previousStatus: this.status,
      step: this
    };
    this._status = to;
    this.emit('statusChange', e);
  }
  public get status() {
    return this._status;
  }

  /**
   * Start the execution.
   * This method is expected to be overridden in specific implementations
   * `super()` can be called if just resolving to the {@link TaskStatus#done} value
   */
  public run() {
    this.status = TaskStatus.done;
  }

  public getOptions = () => ({});
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
