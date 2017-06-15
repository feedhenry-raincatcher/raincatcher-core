import {ProcessInstance} from '../process-instance';
import {Task} from '../task';
/**
 * Definition holder for a linear set of {@link Task}s
 * Intended to be instantiated as a {@link ProcessInstance} in order to be executed
 */
export interface Process {
  /** Unique identifier for this {@link Process} */
  id: string;
  /** Description for UI */
  displayName: string;
  tasks: Task[];

  createInstance(): ProcessInstance;
}

import ProcessImpl from './ProcessImpl';
export default ProcessImpl;
