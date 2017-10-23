import * as _ from 'lodash';

/**
 * TODO create interface for that
 * Queue implementation backed by browser persistent storage
 *
 * @param name
 */
export class FileQueue {
  private queueName: string;
  // TODO interface for datatype
  private queueData: any[];

  public constructor(name: string) {
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
    localStorage.setItem(this.queueName, toSave);
    return this;
  }

  /**
   * Read queue items from local storage
   * @return queue
   */
  public restoreData() {
    const queueDataString = localStorage.getItem(this.queueName);
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
  public getItemList() {
    return this.queueData;
  }

  /**
   * Add new item to queue.
   * @param item   item meta data model
   */
  public addItem(item) {
    this.queueData.push(item);
    this.saveData();
  }
  /**
   * Remove item from queue.
   * @param item   item meta data model
   */
  public removeItem(item) {
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
