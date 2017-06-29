import {ProcessInstance} from './ProcessInstance';
export interface ProcessInstanceRepository {
  // TODO: Methods that return collections/arrays should be paginated
  getAll(): Promise<ProcessInstance[]>;
  /**
   * Retrieve a single entity by id
   */
  getById(id: string): Promise<ProcessInstance>;
  /**
   * Retrieve all instances built from a given Process
   */
  getByProcessId(id: string): Promise<ProcessInstance[]>;
  /**
   * Persist a given ProcessInstance
   */
  create(process: ProcessInstance): Promise<ProcessInstance>;
  /**
   * Retrieve all ProcessInstances that are not assigned to a User
   */
  getUnassigned(): Promise<ProcessInstance[]>;
}
