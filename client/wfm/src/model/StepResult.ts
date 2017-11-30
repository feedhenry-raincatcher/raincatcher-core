/**
 * @module @raincatcher/wfm
 */

import { STATUS } from '../status';
import { Step } from './Step';

/**
 * Represents data returned back from {@link Step}
 * Output of a single {@link Step} in the context of a {@link WorkOrder}
 */
export interface StepResult {
  /**
   * Id of step that is associated with this submission
   */
  stepId: string;
  /**
   * Form data output of the {@link Step}'s execution
   */
  submission?: any;

  /**
   * Identifier of the User that submitted the form data
   */
  submitter?: string;

  /**
   * Unix timestamp of the creation of this result
   */
  timestamp: number;
}
