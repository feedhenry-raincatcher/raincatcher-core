import {ProcessInstance} from './ProcessInstance';
export interface ProcessInstanceRepository {
  // TODO: Methods that return collections/arrays should be paginated
  getAll(): Promise<ProcessInstance[]>;
  getById(id: string): Promise<ProcessInstance>;
  getByProcessId(id: string): Promise<ProcessInstance[]>;
  create(process: ProcessInstance): Promise<ProcessInstance>;
  getUnassigned(): Promise<ProcessInstance[]>;
}
