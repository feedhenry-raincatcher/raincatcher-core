import {Step} from '../step/Step';
import {WorkOrder} from '../workorder/WorkOrder';

/**
 * Definition holder for a linear set of {@link Task}s
 * Intended to be instantiated as a {@link ProcessInstance} in order to be executed
 */
export interface WorkFlow {
  /** Unique identifier for this {@link Process} */
  id: string;
  /** Short description for the User Interface */
  title: string;
  /**
   * Sequential list of {@link Step}s that compose this {@link WorkFlow}
   */
  steps: Step[];
}
