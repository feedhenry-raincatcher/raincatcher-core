import * as _ from 'lodash';
import { FileQueueEntry } from './FileQueueEntry';
/**
 * TODO create interface for that
 * Queue implementation backed by browser persistent storage
 *
 * @param name
 */
export class FileQueue {
  private queueName: string;
  // TODO interface for datatype
  private queueData: FileQueueEntry[];

  public constructor(private localStorage, name: string) {
    this.queueName = name;
    this.queueData = [];
  }

  /**
   * Persist queue items to local storage;
   * @return queue
   */
  public saveData() {
    const toSave = JSON.stringify({
      queue: this.queueData
    });
    this.localStorage.setItem(this.queueName, toSave);
    return this;
  }

  /**
   * Read queue items from local storage
   * @return queue
   */
  public restoreData() {
    const queueDataString = this.localStorage.getItem(this.queueName);
    if (queueDataString) {
      const queueData = JSON.parse(queueDataString);
      this.queueData = queueData.queue;
    } else {
      this.queueData = [];
    }
    return this;
  }

  /**
   * Get items
   */
  public getItemList(): FileQueueEntry[] {
    return this.queueData;
  }

  /**
   * Add new item to queue.
   * @param item   item meta data model
   */
  public addItem(item: FileQueueEntry) {
    this.queueData.push(item);
    this.saveData();
  }
  /**
   * Remove item from queue.
   * @param item   item meta data model
   */
  public removeItem(item: FileQueueEntry) {
    _.remove(this.queueData, item);
    this.saveData();
  }

  /**
   * Read item from queue by id
   */
  public readItem = function(id) {
    return _.find(this.queueData, function(item) {
      return item.id === id;
    });
  };
}
