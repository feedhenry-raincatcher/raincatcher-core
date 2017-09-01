import { STATUS } from '../status';
import { Step } from './Step';

/**
 * Output of a single {@link Step} in the context of a {@link WorkOrder}
 */
export interface StepResult {
  /**
   * Form data output of the {@link Step}'s execution
   */
  submission?: {
    [key: string]: any
  };
  /**
   * Identifier of the User that submitted the form data
   */
  submitter?: string;

  /**
   * Unix timestamp of the creation of this result
   */
  timestamp: number;

  /**
   * Status of the progression of the {@link WorkOrder}
   *
   * @see STATUS
   */
  status: STATUS | string;

  /**
   * Reference to the original {@link Step}
   */
  step: Step;
}
