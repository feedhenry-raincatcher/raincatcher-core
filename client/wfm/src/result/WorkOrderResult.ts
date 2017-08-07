import { STATUS } from '../status';
import { StepResult } from './StepResult';

/**
 * On-going progression of a {@link WorkOrder}, contains data for the individual {@link Step}s
 */
export interface WorkOrderResult {
  /** Unique identifier for this entity, to be used by the storage engine */
  id: string;

  /**
   * Status of the progression of the {@link WorkOrder}
   *
   * @see STATUS
   */
  status: STATUS | string;

  /**
   * Identifier of the related {@link WorkOrder}
   */
  workorderId: string;

  /**
   * Identifier of the User assigned to the {@link WorkOrder}
   */
  assignee: string;

  /**
   * Set of {@link StepResult}s for the {@link Step}s contained in the related {@link WorkOrder}
   */
  stepResults?: {
    [stepCode: string]: StepResult
  };
}
