import {Process} from './Process';
export interface ProcessRepository {
  getAll(): Promise<Process[]>;
  create(process: Process): Promise<Process>;
}
