import {Process} from './Process';
export interface ProcessRepository {
  getAll(): Promise<Process[]>;
  getById(id: string): Promise<Process>;
  create(process: Process): Promise<Process>;
}
