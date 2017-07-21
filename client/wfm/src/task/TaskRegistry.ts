import * as _ from 'lodash';
import { TaskHandler } from './TaskHandler';

/**
 * Registry for containing the set of handlers for custom Task implementations
 */
export class TaskRegistry {
  /**
   * In-memory dictionary that maps string ids to the TaskHandler implementations
   */
  protected storage: {[id: string]: TaskHandler} = {};

  /**
   * Adds one or many handlers to the TaskRegistry
   * @param handler The TaskHandlers to add
   */
  public register(handler: TaskHandler | TaskHandler[]): void {
    if (Array.isArray(handler)) {
      handler.forEach((h: TaskHandler) => this.storage[h.id] = h);
    } else {
      this.storage[handler.id] = handler;
    }
  }

  /**
   * Obtain a single TaskHandler by its unique id
   * @param id Unique identification for the TaskHandler
   */
  public get(id: string): TaskHandler {
    return this.storage[id];
  }

  /**
   * Lists available ids for TaskHandlers
   */
  public listAvailable(): string[] {
    return _.keys(this.storage);
  }
  public list(): TaskHandler[] {
    return _.values(this.storage);
  }
}
