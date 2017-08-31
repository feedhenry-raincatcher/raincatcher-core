import { getLogger } from '@raincatcher/logger';
import * as express from 'express';
import * as sync from 'fh-sync';
import * as path from 'path';
const logger = getLogger();

/**
 * Create middleware for swapping user id with logged user.
 * By using this middleware sync implementations can make sure that filter passed from user
 * application wasn't modified to fetch another user data.
 *
 * Note: this middleware requires req.user.id to be present
 *
 * @param dataset - id of dataset to filter
 * @param fieldName - name of field that should be substituted with user id
 * @param explicit - reject other query parameters and filter only by user field
 */
export function userMapperMiddleware(dataset: string, fieldName: string, explicit?: boolean) {
  const middleware = function(req: express.Request, res: express.Response, next) {
    if (req.user) {
      if (req.body.dataset_id === dataset && req.body.query_params) {
        if (explicit) {
          req.body.query_params = {};
        }
        req.body.query_params[fieldName] = req.user.id;
      }
      next();
    } else {
      getLogger().info('Sync request made without user session present');
      next(new Error('Security error. User is not present'));
    }
  };
  return middleware;
}
