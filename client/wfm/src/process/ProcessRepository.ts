import { ConsoleLogger, Logger } from '@raincatcher/logger';
import {Process} from './Process';

const log: Logger = new ConsoleLogger();

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
}
