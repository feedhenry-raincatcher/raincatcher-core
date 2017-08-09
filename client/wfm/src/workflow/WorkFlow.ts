import { Step } from '../step/Step';
import { WorkOrder } from '../workorder/WorkOrder';

/**
 * Definition holder for a linear set of {@link Step}s
 */
export interface WorkFlow {
  /** Unique identifier for this {@link WorkFlow} */
  id: string;
  /** Short description for the User Interface */
  title: string;
  /**
   * Sequential list of {@link Step}s that compose this {@link WorkFlow}
   */
  steps: Step[];
}
