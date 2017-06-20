import ProcessInstance from '../process-instance/ProcessInstance';
import Process from '../process/Process';

/**
 * Executor engine for a {@link Process}
 *
 * Triggers instantiation and execution of a {@link ProcessInstance}
 */
interface Executor {
  process: Process;
  instance?: ProcessInstance;
  start(): void;
}

export default Executor;
