import * as Promise from 'bluebird';
import { min } from 'lodash';
import { STATUS } from '../status';

type LatLng = [number, number];

/**
 * The executable instance of a {@link WorkFlow}
 */
export interface WorkOrder {
  /**
   * Unique identifier for this ProcessInstance
   */
  id: string;

  /**
   * Id for the {@link User} responsible for the execution of this {@link WorkOrder}
   * Can be empty if there are no {@link Step}s require human interaction
   */
  assignee?: string;

  /**
   * Id for the {@link WorkFlow} that originated this {@link WorkOrder}
   */
  workflowId: string;

  /**
   * Display name for this {@link ProcessInstance}
   */
  title: string;

  /**
   * Longer description for this {@link ProcessInstance}
   */
  summary: string;

  /**
   * Status of the progression of the {@link WorkOrder}
   *
   * @see STATUS
   */
  status: STATUS | string;

  /**
   * Container for extra metadata for this {@link WorkOrder}, such as timestamps,
   * physical location for execution of work, etc.
   */
  data: object;
}
