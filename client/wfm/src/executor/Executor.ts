import * as Promise from 'bluebird';
import {ProcessInstance} from '../process-instance/ProcessInstance';
import {Process} from '../process/Process';
import {Task} from '../task/Task';

/**
 * Data representing the current status of the Executor
 */
export interface Summary {
  /** The {@link Process} that this execution is based on */
  process: Process;
  /** The {@link ProcessInstance} being executed */
  ProcessInstance: ProcessInstance;
  /** The index of the current active {@link Task} */
  index: number;
  /** The current active {@link Task} */
  task: Task;
}

/**
 * Executor engine for a {@link Process}
 *
 * Triggers instantiation and execution of a {@link ProcessInstance}
 */
export interface Executor {
  /**
   * {@link Process} to be executed
   */
  process: Process;
  /**
   * {@link ProcessInstance} that is created based on {@link Process}
   */
  instance?: ProcessInstance;

  /**
   * Starts the execution of the assigned Process
   */
  start(): void;

  /**
   * Alters the ProcessInstance, putting the current Task on hold and moving execution to the previous one
   */
  movePrevious(): Promise<Summary>;

  getSummary(): Promise<Summary>;
}
