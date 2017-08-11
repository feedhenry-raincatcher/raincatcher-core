
import { WorkFlow, WorkOrder, WorkOrderResult } from '@raincatcher/wfm';
import * as Promise from 'bluebird';
import * as express from 'express';
import * as _ from 'lodash';
import { Db } from 'mongodb';
import { ApiConfig, defaultConfiguration } from './ApiConfig';
import { ApiController } from './impl/ApiController';
import { MongoDbRepository } from './impl/MongoDbRepository';

/**
 * RESTfull api handlers for Workorders, Workflows and Results (WFM objects)
 */
export class WfmRestApi {
  private config;
  private workorderService: MongoDbRepository<WorkOrder>;
  private workflowService: MongoDbRepository<WorkFlow>;
  private resultService: MongoDbRepository<WorkOrderResult>;

  constructor(userConfig?: ApiConfig) {
    this.config = _.defaults(defaultConfiguration, userConfig);
    this.createWFMServices();
  }

  /**
   * Create new router for hosting WFM http api.
   */
  public createWFMRouter() {
    const router: express.Router = express.Router();
    const workorderController = new ApiController<WorkOrder>(router, this.workorderService,
      this.config.workorderApiName);
    workorderController.applyAllRoutes();
    const workflowController = new ApiController<WorkFlow>(router, this.workflowService, this.config.workflowApiName);
    workflowController.applyAllRoutes();
    const resultController = new ApiController<WorkOrderResult>(router, this.resultService, this.config.resultApiName);
    resultController.applyAllRoutes();
    return router;
  }

  /**
   * Inject database connection to services
   *
   * @param db - mongodb driver
   */
  public setDb(db: Db) {
    this.workorderService.setDb(db);
    this.workflowService.setDb(db);
    this.resultService.setDb(db);
  }

  protected createWFMServices() {
    this.workorderService = new MongoDbRepository(this.config.workorderCollectionName);
    this.workflowService = new MongoDbRepository(this.config.workflowCollectionName);
    this.resultService = new MongoDbRepository(this.config.resultCollectionName);
  }
}
