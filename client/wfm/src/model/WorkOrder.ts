import * as Promise from 'bluebird';
import { min } from 'lodash';
import { STATUS } from '../status';
import { WorkFlow } from './WorkFlow';
import { WorkOrderResult } from './WorkOrderResult';

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
   * Display name for this {@link ProcessInstance}
   */
  title: string;

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
  data?: any;

  /**
   * Contains workflow that will be used for this workorders.
   * {@link WorkFlow}  this {@link WorkOrder}
   */
  workflow: WorkFlow | any;

  /**
   * Contains data (results) from step execution
   */
  result: WorkOrderResult | any;

  /**
   * Contains id of the current active step (if empty means that workflow has no active step)
   */
  currentStep?: string;
}
