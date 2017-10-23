
import { getLogger } from '@raincatcher/logger';
import { WorkFlow, WorkOrder } from '@raincatcher/wfm';
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
  private config: ApiConfig;
  private workorderService: MongoDbRepository<WorkOrder>;
  private workflowService: MongoDbRepository<WorkFlow>;

  constructor(userConfig?: Partial<ApiConfig>) {
    this.config = _.defaults(defaultConfiguration, userConfig);
    this.createWFMServices();
  }

  /**
   * Create new router for hosting WFM http api.
   */
  public createWFMRouter() {
    const router: express.Router = express.Router();
    const { workorderApiName, workflowApiName, resultApiName } = this.config;
    getLogger().info('WFM web api initialization');
    router.use(`/${workorderApiName}`, new ApiController<WorkOrder>(this.workorderService).buildRouter());
    router.use(`/${workflowApiName}`, new ApiController<WorkFlow>(this.workflowService).buildRouter());
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
  }

  protected createWFMServices() {
    this.workorderService = new MongoDbRepository(this.config.workorderCollectionName);
    this.workflowService = new MongoDbRepository(this.config.workflowCollectionName);
  }
}
