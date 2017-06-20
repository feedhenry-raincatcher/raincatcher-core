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
  /**
   * Sequential list of {@link Task}s that compose this {@link Process}
   */
  tasks: Task[];

  // TODO: Maybe move this to Executor
  /**
   * Instantiates a {@link ProcessInstance} for execution
   */
  createInstance(): ProcessInstance;
}

export default Process;
