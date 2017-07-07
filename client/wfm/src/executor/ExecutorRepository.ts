import { ConsoleLogger, Logger } from '@raincatcher/logger';
import * as Promise from 'bluebird';
import {ProcessInstance} from '../process-instance/ProcessInstance';

const log: Logger = new ConsoleLogger();
/**
 *
 */
export interface ExecutorRepository {
  saveInstance(instance: ProcessInstance): Promise<ProcessInstance>;
}
