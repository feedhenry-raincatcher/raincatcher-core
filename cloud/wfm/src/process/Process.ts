import ProcessInstance from '../process-instance/ProcessInstance';
import Task from '../task/Task';
/**
 * Definition holder for a linear set of {@link Task}s
 * Intended to be instantiated as a {@link ProcessInstance} in order to be executed
 */
interface Process {
  /** Unique identifier for this {@link Process} */
  id: string;
  /** Description for UI */
  displayName: string;
  tasks: Task[];

  createInstance(): ProcessInstance;
}

export default Process;
