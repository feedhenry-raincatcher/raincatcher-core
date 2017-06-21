/**
 * Represents pagged result
 */
export interface PaggedResult<T>{
  totalPages: number;
  totalItems: number;
  data: T[];
}
