import * as _ from 'lodash';
import { FileQueueEntry } from './FileQueueEntry';

/**
 * A queue implementation backed by the browser's persistent storage.
 */
export class FileQueue {
  private queueName: string;
  private queueData: FileQueueEntry[];

  public constructor(private localStorage, name: string) {
    this.queueName = name;
    this.queueData = [];
  }

  /**
   * Save queue items to localStorage
   */
  public saveData() {
    const toSave = JSON.stringify({
      queue: this.queueData
    });
    this.localStorage.setItem(this.queueName, toSave);
    return this;
  }

  /**
   * Restore the local queueData to reflect the data of the queue in localStorage.
   */
  public restoreData() {
    this.queueData = [];
    const queueDataString = this.localStorage.getItem(this.queueName);
    if (queueDataString) {
      const queueData = JSON.parse(queueDataString);
      if (!_.isEmpty(queueData.queue)) {
        this.queueData = queueData.queue;
      }
    }
    return this;
  }

  /**
   * Get the local queue items
   */
  public getItemList(): FileQueueEntry[] {
    return this.queueData;
  }

  /**
   * Add a new item to the queue
   * @param item - Contains information required to upload files to the server.
   * @see FileQueueEntry
   */
  public addItem(item: FileQueueEntry) {
    this.queueData.push(item);
    return this.saveData();
  }

  /**
   * Remove an item from the queue.
   * @param item - Contains file information.
   * @see FileQueueEntry
   */
  public removeItem(item: FileQueueEntry) {
    _.remove(this.queueData, item);
    return this.saveData();
  }

  /**
   * Reads an item from the queue using an id.
   *
   * @param id - A unique identifier used to identify the item to be read from the queue.
   */
  public readItem(id): FileQueueEntry | undefined {
    return _.find(this.queueData, function(item) {
      return item.id === id;
    });
  }
}
