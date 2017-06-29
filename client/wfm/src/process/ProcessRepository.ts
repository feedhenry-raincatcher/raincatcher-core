import {Process} from './Process';
export interface ProcessRepository {
  // TODO: Methods that return collections/arrays should be paginated
  getAll(): Promise<Process[]>;
  getById(id: string): Promise<Process>;
  create(process: Process): Promise<Process>;
}
