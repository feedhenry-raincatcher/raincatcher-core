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
import {cloneDeep, filter, isFunction, map} from 'lodash';
import {VehicleInspectionTask} from '../vehicle-inspection/VehicleInspectionTask';

class Server {
  public app = express();
  public port = process.env.PORT || 3000;

  constructor(
    protected processRepo: ProcessRepository,
    protected processInstanceRepo: ProcessInstanceRepository
    // TODO: add logger module
  ) {
    this.setupExpressMiddleware();
    this.setupExpressRoutes();
  }

  public listen(cb?: () => any) {
    return this.app.listen(this.port, () => {
      // tslint:disable-next-line:no-console
      console.log(`Server listening at port ${this.port}`);
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
    const processRouter = express.Router();
    processRouter.get('/', (req, res) =>
      this.processRepo.getAll().then(processes => res.json(processes)));
    processRouter.post('/', (req, res) =>
      this.createProcess(req.body).then(process => res.json(process)));
    this.app.use('processes/', processRouter);

    const processInstanceRouter = express.Router();
    processInstanceRouter.get('/', (req, res) =>
      this.processInstanceRepo.getAll().then(instances => res.json(instances)));
    processInstanceRouter.get('/unassigned', (req, res) =>
      this.processInstanceRepo.getUnassigned().then(instances => res.json(instances)));

    const taskRouter = express.Router();
    // Looks like the options schema would be a better fit for a static property,
    // but it's complicated to enforce it on typescript:
    // https://github.com/Microsoft/TypeScript/issues/13462#issuecomment-272669082
    const vehicleInspectionSchema = new VehicleInspectionTask().getOptionsSchema();
    taskRouter.get('/schemas', (req, res) => res.json({
      'VehicleInspectionTask': vehicleInspectionSchema
    }));
  }

  protected createProcess(formData: any) {
    const tasks: Task[] = map<any, any>(formData.tasks, taskData => {
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
