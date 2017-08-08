
import * as express from 'express';
import { Db } from 'mongodb';
import { config } from './ApiConfig';
import { DataController } from './DataController';
import { DataService } from './DataService';

/**
 * Create RESTFULL API for fetching WFM objects from mongo database.
 */
export function buildApiRouter(db: Db) {
  const router: express.Router = express.Router();
  // TODO Pagination https://github.com/expressjs/express-paginate
  // TODO Wrap controller with security interface
  router.route('/test').get(function(req: express.Request, res: express.Response) {
    res.json({ test: 'test' });
  });
  const workorderService = new DataService(db, config.workorderApiName);
  const workorderController = new DataController(router, workorderService, config.workorderApiName);

  const workflowService = new DataService(db, config.workflowApiName);
  const workflowController = new DataController(router, workflowService, config.workflowApiName);

  const resultService = new DataService(db, config.resultApiName);
  const resultController = new DataController(router, resultService, config.resultApiName);

  return router;
}
