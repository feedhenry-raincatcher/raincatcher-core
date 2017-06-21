/**
 * Sorting directions
 */
export enum DIRECTION {
  ASC,
  DESC
}


/**
 * Interface used to monitor sorting requirements
 */
export interface SortOrder {
  // List of fields to sort results
  sortData: string[]
  // Sort direction
  direction: DIRECTION

}
