import {ProcessInstance} from './ProcessInstance';
export interface ProcessInstanceRepository {
  getAll(): Promise<ProcessInstance[]>;
  create(process: ProcessInstance): Promise<ProcessInstance>;
  getUnassigned(): Promise<ProcessInstance[]>;
}
