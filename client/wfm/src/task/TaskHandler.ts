import { ProcessInstance } from '../process-instance/ProcessInstance';
import { Result } from '../result/Result';
import { Task } from './Task';
export interface TaskHandler {
  id: string;
  displayName: string;
  execute(task: Task, processInstance: ProcessInstance): void;
  finish(task: Task, processInstance: ProcessInstance): Result;
  previous(task: Task, processInstance: ProcessInstance): Result;
}
