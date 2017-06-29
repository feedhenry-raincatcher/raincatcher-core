import {ProcessInstance} from './ProcessInstance';
export interface ProcessInstanceRepository {
  getAll(): Promise<ProcessInstance[]>;
  getById(id: string): Promise<ProcessInstance>;
  getByProcessId(id: string): Promise<ProcessInstance[]>;
  create(process: ProcessInstance): Promise<ProcessInstance>;
  getUnassigned(): Promise<ProcessInstance[]>;
}
