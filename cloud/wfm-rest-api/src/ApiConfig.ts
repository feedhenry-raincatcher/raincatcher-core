/**
 * @module @raincatcher/wfm-rest-api
 */

/**
 * Module configuration interface
 * Holds all values that can be changed to modify module behavior
 */
export interface ApiConfig {
  /** Root path for the WorkOrder http endpoints */
  workorderApiName: string;
  /** Root path for the WorkFlow http endpoints  */
  workflowApiName: string;
  /** Root path for the Result http endpoints  */
  resultApiName: string;
  /** Collection name to make database query for workorder */
  workorderCollectionName: string;
  /** Collection name to make database query for workflow */
  workflowCollectionName: string;
  /** Collection name to make database query for result */
  resultCollectionName: string;
}

/**
 * Default module configuration
 */
export const defaultConfiguration: ApiConfig = {
  workorderApiName: 'workorders',
  workflowApiName: 'workflows',
  resultApiName: 'results',
  workorderCollectionName: 'workorders',
  workflowCollectionName: 'workflows',
  resultCollectionName: 'result'
};
