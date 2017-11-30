/**
 * @module @raincatcher/wfm-rest-api
 */

/**
 *  Interface for pagination information.
 *  Represents page request (passed from client)
 *
 *  @field page - zero-based page index.
 *  @field size - the size of the page to be returned.
 */
export interface PageRequest {
  /**
   * Requested page number
   */
  page: number;
  /**
   * Total page size (numer of elements to return)
   */
  size: number;
}

/**
 * Page request that also allows to define sort field and direction
 */
export interface SortedPageRequest extends PageRequest {
  /**
   * Name of the field to sort
   */
  sortField?: string;
  /**
   * Order of the sort direction
   */
  order?: DIRECTION;
}

/**
 * Sorting directions
 */
export enum DIRECTION {
  ASC = 1,
  DESC = -1
}
