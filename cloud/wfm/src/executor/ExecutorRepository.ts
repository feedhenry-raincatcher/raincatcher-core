import * as Promise from 'bluebird';
import ProcessInstance from '../process-instance/ProcessInstance';
interface ExecutorRepository {
  saveInstance(instance: ProcessInstance): Promise<ProcessInstance>;
}

export default ExecutorRepository;
