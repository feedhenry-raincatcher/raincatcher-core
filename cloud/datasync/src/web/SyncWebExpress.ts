import * as Promise from 'bluebird';
import * as Express from 'express';
import * as path from 'path';
import * as secMiddleware from './SyncSecurityMiddleware';

import * as sync from 'fh-sync'

/**
 * Expose Feedhenry Sync API using express middleware
 */
export class SyncExpressMiddleWare {

  private router: Express.Router;
  private prefix: String;

  /**
   * @field prefix - used to create api endpoint
   */
  constructor(prefix: String) {
    this.router = Express.Router();
    this.prefix = prefix;
  }
  /**
   * Create express router for sync endpoints
   */
  public createSyncExpressRouter() {
    const apiURI = path.join(this.prefix + ':datasetId');
    const syncRoute = this.router.route(apiURI);

    /**
     * Sync express api required for sync clients
     * All sync clients will call that endpoint to sync data
     */
    syncRoute.post(this.syncHandler);
    return this.router;
  }

  /**
   * Middleware handler responsible for calling sync api
   */
  private syncHandler(req: Express.Request, res: Express.Response) {
    const datasetId = req.params.datasetId;
    const params = req.body;
    sync.api.invoke(datasetId, params, function (err: any, result: any) {
      if (err) {
        res.status(500).json(err);
        return;
      }
      return res.json(result);
    });
  }

  /** Returns router instance */
  public getRouter() {
    return this.router;
  };
}

export default SyncExpressMiddleWare;
