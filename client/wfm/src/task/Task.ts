import {EventEmitter} from 'eventemitter3';
import {Result} from '../result/Result';

export interface TaskEventData<T extends Task> {
  /**
   * The {@link Task} that triggered this event
   */
  task: T;
  /**
   * The previous {@link TaskStatus} of the {@link Task}
   */
  previousStatus: TaskStatus;
  /**
   * The current {@link TaskStatus} of the {@link Task}
   */
  currentStatus: TaskStatus;
  /**
   * The time when the status change happened
   */
  date: Date;
}

export type TaskEventHandler<T extends Task> = (e: TaskEventData<T>) => any;

/**
 * Set of high-level status types, intended to have semantic meaning
 * for UI (color-coding, tips) and data (reporting and graphing).
 * Idea based on HTTP status codes
 *
 *  The intervals between each of the values can be used by custom implementations
 * for additional statuses
 *
 * Another advantage is that apart from 'blocked' in general steps are expected to move to higher-numbered statuses
 */
export enum TaskStatus {
  /**
   * Indicates that the Task has been created and is unassigned
   */
  'New' = 0,
  /**
   * Indicates that the Task has been assigned to an executor and is pending initiation
   */
  'Unassigned' = 100,
  /**
   * Indicates that the Task has begun being executed
   */
  'In Progress' = 200,
  /**
   * Indicates that the Task has finished successfully
   */
  'Complete' = 300,
  /**
   * Indicates that the Task has had its execution paused by a resolvable issue and can be resumed
   */
  'On Hold' = 400,
  /**
   * Indicates that the Task has finished in an unpredicted and unrecoverable state
   */
  'Aborted' = 500
}

/**
 * Represents a single unit of work to be executed by a human or by the system.
 * Each task potentially has it's own, implementation-specific Result, and
 */
export interface Task {
  /**
   * Unique identifier for this {@link Task}
   */
  id: string;
  /**
   * Current status, see {@link TaskStatus}
   */
  status: TaskStatus | number;
  /**
   * The name of the type that provides the implementation logic for this Task
   */
  code: string;
  /**
   * A descriptive name for displaying in the UI for this Task
   */
  name: string;
  /**
   * Assignee Id, can be left undefined for {@link Task}s that
   * require no human interaction
   */
  assignee?: string;
  /**
   * Id of the {@link ProcessInstance} this {@link Task} belongs to
   */
  processInstanceId: string;
  /**
   * Options for configuring a custom {@link Task}
   */
  options?: object;
}

/**
 * Returns the current Task's status, rounded down to the nearest TaskStatus
 * (i.e. ignoring custom intermediate status)
 *
 * @param task A {@link Task} or its status
 */
export function getRoundedStatus(task: Task | number): TaskStatus {
  let status;
  if (typeof task === 'number') {
    status = task;
  } else {
    status = task.status;
  }
  const roundedDownStatus = status - (status % 100);
  return roundedDownStatus || TaskStatus.New;
}
