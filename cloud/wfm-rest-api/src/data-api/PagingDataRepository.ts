import * as Promise from 'bluebird';
import { Db } from 'mongodb';
import { SortedPageRequest } from '../data-api/PageRequest';
import { PageResponse } from '../data-api/PageResponse';

/**
 * Interface for building CRUD database repository.
 * Clients should implement this interface to connect storage of WFM objects
 * with different data storage engines like MySQL etc.
 * Interface is being used internally to perform database operations for WFM models
 * It's not recomended to use it for other application business logic.
 */
export interface PagingDataRepository {

  /**
   * Retrieve list of results from database
   * Supports pagination
   *
   * @param filter - filter for list (for example {id: 'user'})
   * @param request - page request for filter
   *
   * @see PageRequest
   * @see PageResponse
   */
  list(filter: any, request: SortedPageRequest): Promise<PageResponse>;

  /**
   * Get specific item from database
   * @param id - object id
   */
  get(id: any): Promise<any>;

  /**
   * Store object in database
   * @param object - object to store
   */
  create(object: any): Promise<any>;

  /**
   * Update object
   * @param object - object to update
   * Note: id field of the object will be used to determine what should be updated
   */
  update(object: any): Promise<any>;

  /**
   * Delete object from database
   * @param id - object id
   */
  delete(id: any): Promise<any>;
}
