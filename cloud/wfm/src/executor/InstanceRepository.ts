import {ProcessInstance} from '../process-instance';
export interface InstanceRepository {
  save(instance: ProcessInstance): Promise<ProcessInstance>;
}
