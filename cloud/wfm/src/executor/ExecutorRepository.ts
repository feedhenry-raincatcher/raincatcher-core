import * as Promise from 'bluebird';
import ProcessInstance from '../process-instance/ProcessInstance';

export interface ExecutorRepository {
  saveInstance(instance: ProcessInstance): Promise<ProcessInstance>;
}

export default ExecutorRepository;
