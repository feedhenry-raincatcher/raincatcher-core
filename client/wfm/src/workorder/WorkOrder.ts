import * as Promise from 'bluebird';
import { min } from 'lodash';

type LatLng = [number, number];

/**
 * The executable instance of a {@link Process}
 */
export interface WorkOrder {
  /**
   * Unique identifier for this ProcessInstance
   */
  id: string;

  type: string;

  /**
   * Id for the {@link User} responsible for the execution of this {@link ProcessInstance}
   * Can be empty if the no tasks require human interaction
   */
  assignee?: string;

  /**
   * Id for the {@link Process} that originated this {@link ProcessInstance}
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

  status: string;

  startTimestamp?: Date | string;

  finishTimestamp?: Date | string;

  address?: string;

  location: LatLng;

}
