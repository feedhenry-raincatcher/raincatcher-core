import {Process} from './Process';
export interface ProcessRepository {
  // TODO: Methods that return collections/arrays should be paginated
  getAll(): Promise<Process[]>;
  /**
   * Retrieve a single entity by id
   */
  getById(id: string): Promise<Process>;
  /**
   * Persist a given Process
   */
  create(process: Process): Promise<Process>;

  /**
   * Deletes a single Process
   */
  delete(process: string | Process): Promise<Process>;
}
