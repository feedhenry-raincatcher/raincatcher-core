
import { PageRequest } from '../data-api/PageRequest';
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
   * @param query - list of arguments passed as http query parameters
   */
  public buildRequestFromQuery(query: any): PageRequest {
    let page;
    let size;
    if (query.size) {
      size = query.size;
    } else {
      size = this.defaultPageSize;
    }
    if (query.page) {
      page = query.page;
    } else {
      page = 1;
    }
    return { page, size };
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
