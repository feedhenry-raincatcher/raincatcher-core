import { getLogger } from '@raincatcher/logger';
import { ApiError } from '@raincatcher/wfm-rest-api';
import * as Bluebird from 'bluebird';
import * as express from 'express';
import { NextFunction, Request, RequestHandler, Response, Router } from 'express';
import { UsersRepository } from './UsersRepository';

const INVALID_FILTER_ERROR = 'InvalidFilter';
const DEFAULT_QUERY_LIMIT = 10;

/**
 * Express based controller for user related operations
 */
export class UserController {

  constructor(readonly repository: UsersRepository) {
  }

  /**
   * Handler using `UsersRepository` to fetch list of the users
   */
  public listUsersHandler(req: Request) {
    getLogger().debug('Api list method called', { body: req.query });
    if (!req.query.filter) {
      getLogger().debug('Invalid filter passed');
      const error = new ApiError(INVALID_FILTER_ERROR, 'Missing user fiter', 400);
      return Bluebird.reject(error);
    }
    const limit = req.query.limit || DEFAULT_QUERY_LIMIT;
    return this.repository.retrieveUsers(req.query.filter, limit);
  }

  /**
   * Build all routes and return new router instance
   */
  public buildRouter(): Router {
    const self = this;
    const router = express.Router();
    getLogger().info('User web api initialization');
    router.route('/')
      .get(function(request, response, next) {
        self.listUsersHandler(request).then(function(data) {
          return response.json(data);
        }).catch(next);
      });
    return router;
  }
}
