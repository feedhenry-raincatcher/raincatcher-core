import {Task} from './Task';
export interface TaskRepository {
  getAll(): Promise<Task[]>;
  createBatch(tasks: Task[]): Promise<Task[]>;
}
