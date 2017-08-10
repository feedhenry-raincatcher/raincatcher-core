
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
  private workorderService: MongoDbRepository;
  private workflowService: MongoDbRepository;
  private resultService: MongoDbRepository;

  constructor(userConfig?: ApiConfig) {
    this.config = _.defaults(defaultConfiguration, userConfig);
  }

  /**
   * Create new router for hosting WFM http api.
   */
  public createWFMRouter() {
    this.createWFMServices();
    const router: express.Router = express.Router();
    const workorderController = new ApiController(router, this.workorderService, this.config.workorderApiName);
    const workflowController = new ApiController(router, this.workflowService, this.config.workflowApiName);
    const resultController = new ApiController(router, this.resultService, this.config.resultApiName);
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
    this.workflowService = new MongoDbRepository(this.config.workflowApiName);
    this.resultService = new MongoDbRepository(this.config.resultApiName);
  }
}
