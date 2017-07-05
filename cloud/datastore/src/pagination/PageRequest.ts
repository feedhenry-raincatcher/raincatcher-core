/**
 *  Represents page request
 *
 *  @field page - zero-based page index.
 *  @field size - the size of the page to be returned.
 * Based on http://docs.spring.io/spring-data/data-commons/docs/current/api/org/springframework/data/domain/Pageable.html
 */
export interface PaggedRequest {
  // Requested page
  page: number;
  size: number;
}
