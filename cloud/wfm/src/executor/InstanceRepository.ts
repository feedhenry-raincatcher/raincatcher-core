import ProcessInstance from '../process-instance/ProcessInstance';
interface InstanceRepository {
  save(instance: ProcessInstance): Promise<ProcessInstance>;
}

export default InstanceRepository;
