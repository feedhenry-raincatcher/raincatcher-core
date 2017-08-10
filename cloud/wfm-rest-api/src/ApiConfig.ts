
/**
 * Module configuration interface
 * Holds all values that can be changed to modify module behavior
 */
export interface ApiConfig {
  /** Used to create workorder route */
  workorderApiName?: string;
  /** Used to create workflow route */
  workflowApiName?: string;
  /** Used to create result route */
  resultApiName?: string;
  /** Used as collection name to make database query for workorder */
  workorderCollectionName?: string;
  /** Used as collection name to make database query for workflow */
  workflowCollectionName?: string;
  /** Used as collection name to make database query for result */
  resultCollectionName?: string;
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
