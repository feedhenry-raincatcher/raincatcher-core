import { ConsoleLogger, Logger } from '@raincatcher/logger';
import * as Promise from 'bluebird';
import {EventEmitter} from 'eventemitter3';
import {cloneDeep, every} from 'lodash';
import {Task, TaskStatus} from '../task/Task';
import {InstanceEventData, InstanceTaskEventData, ProcessInstance} from './ProcessInstance';

const log: Logger = new ConsoleLogger();

export class ProcessInstanceImpl extends EventEmitter implements ProcessInstance {
  public id: string;
  public assigneeId: string;
  public processId: string;
  public currentTask: Task;
  public tasks: Task[];

  protected currentTaskIdx: number;

  // TODO: add repository for data storage
  constructor(initialTasks: Task[]) {
    super();
    if (!initialTasks || initialTasks.length === 0) {
      log.error({level: 'ERROR', tag: 'client wfm process-instance', src: 'ProcessInstanceImpl.ts'},
        'Task list must have at least one item');
      throw new Error('Task list must have at least one item');
    }
    this.tasks = cloneDeep(initialTasks);

    // subscribe to task events so we can track when they all become 'done'
    this.tasks.forEach(t => t.on('statusChange', this.checkDone.bind(this)));

    this.currentTask = this.tasks[0];
    this.currentTaskIdx = 0;
  }

  public nextTask() {
    this.currentTask = this.tasks[++this.currentTaskIdx];
    const e: InstanceTaskEventData<this> = {
      instance: this,
      task: this.currentTask
    };
    this.emit('taskChange', e);
    log.info({level: 'INFO', tag: 'client wfm process-instance', src: 'ProcessInstanceImpl.ts'}, 'taskChange', e);
    return Promise.resolve(this.currentTask);
  }

  public getCurrentTask() {
    return Promise.resolve(this.currentTask);
  }

  public getTasks() {
    return Promise.resolve(this.tasks);
  }

  protected checkDone() {
    if (every(this.tasks, t => t.getRoundedStatus() === TaskStatus.DONE)) {
      const e: InstanceEventData<this> = {
        instance: this
      };
      this.emit('done', e);
      log.info({level: 'INFO', tag: 'client wfm process-instance', src: 'ProcessInstanceImpl.ts'}, 'done', e);
    }
  }
}
