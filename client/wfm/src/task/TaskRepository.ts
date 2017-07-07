import { ConsoleLogger, Logger } from '@raincatcher/logger';
import {Task} from './Task';

const log: Logger = new ConsoleLogger();

export interface TaskRepository {
  /**
   * Persist multiple Tasks at once, commonly used for the list of Tasks in a Process or ProcessInstance
   */
  createMany(tasks: Task[]): Promise<Task[]>;
}
