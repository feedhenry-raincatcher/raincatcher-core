import {Task} from './Task';
export interface TaskRepository {
  // TODO: Methods that return collections/arrays should be paginated
  getAll(): Promise<Task[]>;
  createBatch(tasks: Task[]): Promise<Task[]>;
}
