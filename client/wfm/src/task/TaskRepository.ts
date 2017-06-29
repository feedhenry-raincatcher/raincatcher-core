import {Task} from './Task';
export interface TaskRepository {
  /**
   * Persist multiple Tasks at once, commonly used for the list of Tasks in a Process or ProcessInstance
   */
  createMany(tasks: Task[]): Promise<Task[]>;
}
