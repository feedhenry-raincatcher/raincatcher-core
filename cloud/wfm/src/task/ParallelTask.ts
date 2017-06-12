import BaseTask from './BaseTask';
import { Task } from './index';
/** Represents a set of `Step`s that can be executed in parallel */
class ParallelTask extends BaseTask implements Task {
  public status;
  constructor(public tasks: Task[]) {
    super();
  }
  public run() {
    this.tasks.forEach(s => this.setupListening(s));
  }

  protected setupListening(step: Task) {
    step.on()
  }
}

export default ParallelTask;
