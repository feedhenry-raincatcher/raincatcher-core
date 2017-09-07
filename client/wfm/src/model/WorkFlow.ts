import { Step } from '../model/Step';
import { WorkOrder } from '../model/WorkOrder';

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

  /**
   * Represents version of workflow that is updated each time it's updated
   */
  version: number;
}
