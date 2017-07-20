import {Task} from '../task/Task';
/**
 * The executable instance of a {@link Process}
 */
export interface ProcessInstance {
  /**
   * Unique identifier for this ProcessInstance
   */
  id: string;
  /**
   * Id for the {@link User} responsible for the execution of this {@link ProcessInstance}
   * Can be empty if the no tasks require human interaction
   */
  assignee?: string;

  /**
   * Id for the {@link Process} that originated this {@link ProcessInstance}
   */
  process: string;

  title: string;
  comment: string;
  tasks: string[];
}
