import * as Promise from 'bluebird';
/**
 * Deifinition for data acess service used by the {@link WfmService}
 */
export interface DataService<T> {
  /**
   * Returns the underlying list of items
   */
  list(): Promise<T[]>;
  /**
   * Retrieves a single item per id
   */
  read(id: string): Promise<T | undefined>;
  /**
   * Creates a new item in the underlying storage
   * @param item The item to create
   */
  create(item: T): Promise<T>;
  /**
   * Updates an item in the underlying storage
   * @param item The item to update
   */
  update(item: T): Promise<T>;
  /**
   * Removes the specified item in the underlying storage
   * @param item The item to remove
   */
  remove(item: T): Promise<T>;
}
