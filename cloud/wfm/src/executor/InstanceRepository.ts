import {ProcessInstance} from '../process-instance';
export default interface InstanceRepository {
  save(instance: ProcessInstance): Promise<ProcessInstance>;
}
