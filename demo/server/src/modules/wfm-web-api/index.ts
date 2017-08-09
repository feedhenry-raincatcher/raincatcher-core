
import * as Promise from 'bluebird';
import * as express from 'express';
import { config } from './ApiConfig';
import { DataController } from './DataController';
import { DataService } from './DataService';

/**
 * Create RESTfull API for fetching WFM objects from mongo database.
 */
export function buildApiRouter(dbPromise: Promise<any>) {
  const router: express.Router = express.Router();
  // TODO Pagination https://github.com/expressjs/express-paginate
  // TODO Wrap controller with security interface
  const workorderService = new DataService(dbPromise, config.workorderApiName);
  const workorderController = new DataController(router, workorderService, config.workorderApiName);

  const workflowService = new DataService(dbPromise, config.workflowApiName);
  const workflowController = new DataController(router, workflowService, config.workflowApiName);

  const resultService = new DataService(dbPromise, config.resultApiName);
  const resultController = new DataController(router, resultService, config.resultApiName);
  return router;
}
