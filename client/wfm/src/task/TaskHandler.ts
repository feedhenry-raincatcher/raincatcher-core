import { ProcessInstance } from '../process-instance/ProcessInstance';
import { Result } from '../result/Result';
import { Task } from './Task';
export interface TaskHandler {
  id: string;
  displayName: string;
  /**
   * Starts the execution of a Task
   */
  execute(task: Task, processInstance: ProcessInstance): void;
  /**
   * Should be called when a Task is done
   */
  next(task: Task, processInstance: ProcessInstance): Result;
  /**
   * Should be called upon a user request to move to the previous Task
   */
  previous(task: Task, processInstance: ProcessInstance): Result;
}
