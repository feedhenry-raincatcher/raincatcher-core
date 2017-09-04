import { STATUS } from '../status';
import { StepResult } from './StepResult';

/**
 * On-going progression of a {@link WorkOrder}, contains data for the individual {@link Step}s
 */
export interface WorkOrderResult {
  /**
   * Set of {@link StepResult}s for the {@link Step}s contained in the related {@link WorkOrder}
   */
  stepResults?: {
    // TODO move from step code.
    [stepCode: string]: StepResult
  };
}
