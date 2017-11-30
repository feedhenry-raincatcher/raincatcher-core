/**
 * @module @raincatcher/datasync-cloud
 */

import { getLogger } from '@raincatcher/logger';
import * as Express from 'express';
import * as sync from 'fh-sync';
import * as path from 'path';
const logger = getLogger();
/**
 * Expose Feedhenry Sync API using express middleware
 */
export class SyncExpressMiddleware {

  private router: Express.Router;
  private prefix: string;

  /**
   * @field prefix - used to create api endpoint
   */
  constructor(prefix: string) {
    this.router = Express.Router();
    this.prefix = prefix;
  }

  /**
   * Create express router for sync endpoints
   */
  public createSyncExpressRouter() {
    const apiURI = path.join(this.prefix + '/:datasetId');
    logger.debug('Creating sync endpoint');
    const syncRoute = this.router.route(apiURI);

    /**
     * Sync express api required for sync clients
     * All sync clients will call that endpoint to sync data
     */
    syncRoute.post(this.syncHandler);
    return this.router;
  }

  /** Returns router instance */
  public getRouter() {
    return this.router;
  }

  /**
   * Middleware handler responsible for calling sync api
   */
  private syncHandler(req: Express.Request, res: Express.Response) {
    const datasetId = req.params.datasetId;
    const params = req.body;
    sync.invoke(datasetId, params, function(err: any, result: any) {
      if (err) {
        // tslint:disable-next-line:no-console
        logger.error('Error when processing sync request', { err });
        return res.status(500).json(err);
      }
      return res.json(result);
    });
  }
}

export default SyncExpressMiddleware;
