import * as Promise from 'bluebird';
import { min } from 'lodash';
import { getRoundedStatus, Task, TaskStatus } from '../task/Task';
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

  /**
   * Display name for this {@link ProcessInstance}
   */
  title: string;

  /**
   * Longer description for this {@link ProcessInstance}
   */
  comment: string;

  /**
   * Ordered list of ids for the {@link Task}s
   */
  tasks: string[];
}

export function getAggregateStatus(process: ProcessInstance, getTaskById: (id: string) => Promise<Task>):
Promise<TaskStatus> {
  return Promise.map(process.tasks, getTaskById)
    .then(tasks => tasks.map(t => t.status))
    .then(statuses => min(statuses))
    .then(status => status ? getRoundedStatus(status) : TaskStatus.New);
}
