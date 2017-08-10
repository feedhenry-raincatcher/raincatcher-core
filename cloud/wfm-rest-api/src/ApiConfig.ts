
/**
 * Module configuration interface
 * Holds all values that can be changed to modify module behavior
 */
export interface ApiConfig {
  workorderApiName?: string;
  workflowApiName?: string;
  resultApiName?: string;
  workorderCollectionName?: string;
  workflowCollectionName?: string;
  resultCollectionName?: string;
}

/**
 * Default module configuration
 */
export const defaultConfiguration = {
  workorderApiName: 'workorders',
  workflowApiName: 'workflows',
  resultApiName: 'results',
  workorderCollectionName: 'workorders',
  workflowCollectionName: 'workflows',
  resultCollectionName: 'results'
};
