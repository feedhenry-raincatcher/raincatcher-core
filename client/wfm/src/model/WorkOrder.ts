import * as Promise from 'bluebird';
import { min } from 'lodash';
import { STATUS } from '../status';
import { StepResult } from './StepResult';
import { WorkFlow } from './WorkFlow';

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
  data?: object;

  /**
   * Contains workflow that will be used for this workorders.
   * {@link WorkFlow}  this {@link WorkOrder}
   */
  workflow: WorkFlow;

  /**
   * Contains data (results) from step execution
   */
  results: StepResult[];

  /**
   * Contains id of the current active step (if empty means that workflow has no active step)
   */
  currentStep?: string;

  /**
   * Represents version of workorder that is incremented each time it's updated
   */
  version: number;

  /**
   * Timestamp of this WorkOrder's creation
   */
  created: number;

  /**
   * Timestamp of this WorkOrder's last update
   */
  updated: number;

  /**
   * List of timestamps of when this WorkOrder last reached a given {@link STATUS}
   *
   * @example
   * {
   *   'New': 1506010024468,
   *   'Complete': 1506010024468
   * }
   */
  statusHistory?: {
    [status: string]: number
  };
}
