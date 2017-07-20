import {ProcessInstance} from '../process-instance/ProcessInstance';
import {TaskDefinition} from '../task-definition/TaskDefinition';
import {TaskStatus} from '../task/Task';
/**
 * Definition holder for a linear set of {@link Task}s
 * Intended to be instantiated as a {@link ProcessInstance} in order to be executed
 */
export interface Process {
  /** Unique identifier for this {@link Process} */
  id: string;
  /** Short description for the User Interface */
  title: string;
  /** Description for the User Interface */
  description: string;
  /**
   * Sequential list of {@link Task}s that compose this {@link Process}
   */
  taskDefinitions: TaskDefinition[];
}

export function getAggregateStatus(process: Process): TaskStatus {
  return TaskStatus.ASSIGNED;
}
