
import { Cursor } from 'mongodb';
import { DIRECTION, SortedPageRequest } from '../data-api/PageRequest';
import { PageResponse } from '../data-api/PageResponse';

/**
 * Pagination procesor
 * Clients may override this class to provide custom pagination parameters
 *
 * Note: pages are counted from number 1.
 * Page 0 requests will return empty data.
 */
export class PaginationEngine {

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
  public buildPageResponse(request: SortedPageRequest, cursor: Cursor, totalCount: number) {
    if (request.sortField) {
      if (!request.order) {
        request.order = DIRECTION.ASC;
      }
      cursor = cursor.sort(request.sortField, request.order);
    }
    cursor = cursor.skip(request.size * request.page).limit(request.size);
    return cursor.toArray().then(function(data) {
      return defaultPaginationEngine.buildResponse(Math.ceil(totalCount / request.size), totalCount, data);
    });
  }

  /**
   * @param totalPages - list of pages available
   * @param totalCount - total list of the elements
   * @param data
   */
  public buildResponse(totalPages: number, totalCount: number, data: any[]): PageResponse {
    return {
      totalPages,
      totalCount,
      data
    };
  }
}

export const defaultPaginationEngine = new PaginationEngine(10);
