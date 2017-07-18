import { logger, Logger, setLogger } from '@raincatcher/logger';
import {
  BaseTask,
  Process,
  ProcessImpl,
  ProcessInstance,
  ProcessInstanceRepository,
  ProcessRepository,
  Task,
  TaskRepository
} from '@raincatcher/wfm';
import * as Promise from 'bluebird';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import {isFunction, map} from 'lodash';
import {VehicleInspectionTask} from '../vehicle-inspection/VehicleInspectionTask';

export class HttpServer {
  public app = express();
  public port = process.env.PORT || 3000;

  constructor(
    protected processRepo: ProcessRepository,
    protected processInstanceRepo: ProcessInstanceRepository
  ) {
    this.setupExpressMiddleware();
    this.setupExpressRoutes();
  }

  public listen(cb?: () => any) {
    return this.app.listen(this.port, () => {
      logger.info(`Server listening at port ${this.port}`,
        {level: 'INFO', tag: 'intergration:vehicle-inspection:src:http-server', src: 'index.ts'});
      if (isFunction(cb)) {
        cb();
      }
    });
  }

  protected setupExpressMiddleware() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({extended: true}));
    // TODO: Add new security module
  }

  protected setupExpressRoutes() {
    this.app.use('/processes', this.buildProcessRouter());
    this.app.use('/instances', this.buildProcessInstanceRouter());
    this.app.use('/tasks', this.buildTaskRouter());
  }

  protected buildProcessRouter() {
    const processRouter = express.Router();

    processRouter.get('/', (req, res) =>
      this.processRepo.getAll().then(processes => res.json(processes)));
    processRouter.post('/', (req, res) =>
      this.createProcess(req.body).then(process => res.json(process)));
    processRouter.get('/:id', (req, res) =>
      this.processRepo.getById(req.params.id).then(process => res.json(process)));

    // Sub-routes for instances
    processRouter.get('/:id/instances', (req, res) =>
      this.processInstanceRepo.getByProcessId(req.params.id).then(instances => res.json(instances)));
    processRouter.post('/:id/instances', (req, res) =>
      this.processRepo.getById(req.params.id).then(process => res.json(process)));

    return processRouter;
  }

  protected buildProcessInstanceRouter() {
    const processInstanceRouter = express.Router();

    processInstanceRouter.get('/unassigned', (req, res) =>
      this.processInstanceRepo.getUnassigned().then(instances => res.json(instances)));
    processInstanceRouter.get('/', (req, res) =>
      this.processInstanceRepo.getAll().then(instances => res.json(instances)));

    return processInstanceRouter;
  }

  protected buildTaskRouter() {
    const taskRouter = express.Router();
    // Looks like the options schema would be a better fit for a static property,
    // but it's complicated to enforce it on typescript:
    // https://github.com/Microsoft/TypeScript/issues/13462#issuecomment-272669082
    const vehicleInspectionSchema = new VehicleInspectionTask().getOptionsSchema();
    taskRouter.get('/schemas', (req, res) => res.json({
      'VehicleInspectionTask': vehicleInspectionSchema
    }));

    return taskRouter;
  }

  protected createProcess(formData: any) {
    const tasks: Task[] = map<any, Task>(formData.tasks, taskData => {
      let task: Task;
      // We can move this to a more robust dictionary-based registerTaskFactory(factory: (data) => Task)
      switch (taskData.type) {
        case 'VehicleInspectionTask':
          task = new VehicleInspectionTask();
          task.setOptions(taskData.options);
          break;
        default:
          task = new BaseTask();
          task.setOptions(taskData.options);
          break;
      }
      return task;
    });

    // Here the process repo would persist its own Tasks via a sub-repository
    // i.e. new ProcessRepositoryImpl(taskRepo: TaskRepository) {...}
    return this.processRepo.create(new ProcessImpl(formData.name, tasks));
  }
}
