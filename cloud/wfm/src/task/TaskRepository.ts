import {Task} from './Task';
export interface TaskRepository {
  createBatch(tasks: Task[]): Promise<Task[]>;
}
