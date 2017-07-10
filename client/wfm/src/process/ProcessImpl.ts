import { ConsoleLogger, Logger } from '@raincatcher/logger';
import {ProcessInstanceImpl} from '../process-instance/ProcessInstanceImpl';
import {Task} from '../task/Task';
import {Process} from './Process';

const log: Logger = new ConsoleLogger();

export class ProcessImpl implements Process {
  public id: string;
  constructor(public displayName: string, public tasks: Task[]) {
  }

  public createInstance() {
    if (!this.tasks || this.tasks.length === 0) {
      log.error({tag: 'wfm process', src: 'ProcessImpl.ts'}, 'Task list must be set before calling createInstance()');
      throw new Error('Task list must be set before calling createInstance()');
    }
    // TODO: Replace this with customizable derivative of ProcessInstanceImpl
    // make generic of <T implements ProcessInstance>
    const instance = new ProcessInstanceImpl(this.tasks);
    return instance;
  }
}
