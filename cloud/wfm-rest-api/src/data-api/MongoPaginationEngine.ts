/**
 * @module @raincatcher/wfm-rest-api
 */


import * as Promise from 'bluebird';
import { Cursor } from 'mongodb';
import { DIRECTION, SortedPageRequest } from '../data-api/PageRequest';
import { PageResponse } from '../data-api/PageResponse';

/**
 * Mongo pagination processor
 * Clients may override this class to provide custom pagination parameters
 *
 * Note: pages are counted starting from 0.
 */
export class MongoPaginationEngine {

  /**
   * @param defaultPageSize Default page size added when parameter is missing
   */
  constructor(readonly defaultPageSize: number) {
  }

  /**
   * Create page request from query
   *
   * @param query - list of arguments passed as http query parameters
   *
   * Expected query example:
   * {
   *  page:1,
   *  size:10,
   *  sortField: "id",
   *  order: 1
   * }
   */
  public buildRequestFromQuery(query: any): SortedPageRequest {
    let page;
    let size;
    let order;
    if (query.size) {
      size = Number(query.size);
    } else {
      size = this.defaultPageSize;
    }
    if (query.page) {
      page = Number(query.page);
    } else {
      page = 0;
    }
    if (query.order) {
      order = Number(query.order);
    }
    return { page, size, sortField: query.sortField, order };
  }

  /**
   * Fetch data using PageRequest and return PaggedResponse
   *
   * @param cursor mongodb cursor
   * @param totalCount total number of results
   * @param request page request
   */
  public buildPageResponse<T>(request: SortedPageRequest, cursor: Cursor<T>, totalCount: number):
  Promise<PageResponse<T>> {
    if (request.sortField) {
      if (!request.order) {
        request.order = DIRECTION.ASC;
      }
      cursor = cursor.sort(request.sortField, request.order);
    }
    cursor = cursor.skip(request.size * request.page).limit(request.size);
    return Promise.resolve(cursor.toArray()).then(function(data) {
      const totalPages = Math.ceil(totalCount / request.size);
      return {
        totalPages,
        totalCount,
        data
      };
    });
  }
}

export const defaultPaginationEngine = new MongoPaginationEngine(10);
