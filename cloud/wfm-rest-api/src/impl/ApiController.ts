import { getLogger } from '@raincatcher/logger';
import * as express from 'express';
import { NextFunction, Request, Response, Router } from 'express';
import { ApiError } from '../data-api/ApiError';
import { defaultPaginationEngine } from '../data-api/MongoPaginationEngine';
import { PagingDataRepository } from '../data-api/PagingDataRepository';
import * as errorCodes from './ErrorCodes';

/**
 * Generic controller that can be used to create API for specific objects
 */
export class ApiController<T> {
  constructor(
    readonly router: Router,
    readonly repository: PagingDataRepository<T>,
    readonly apiPrefix: string) {
  }

  /**
   * Handler for list method
   * Can be reused by developers that wish to mount handler directly on router
   */
  public listHandler(req: Request, res: Response, next: NextFunction) {
    getLogger().debug('Api list method called',
      { object: this.apiPrefix, body: req.query });
    const page = defaultPaginationEngine.buildRequestFromQuery(req.query);
    let filter = {};
    if (req.body.filter) {
      filter = req.body.filter;
    } else if (req.query.filter) {
      try {
        filter = JSON.parse(req.query.filter);
      } catch (err) {
        getLogger().error('Invalid filter passed');
        const error = new ApiError(errorCodes.CLIENT_ERROR, 'Invalid filter query parameter', 400);
        return next(error);
      }
    }
    return this.repository.list(filter, page).then(function(data) {
      res.json(data);
    }).catch(next);
  }

  /**
   * Handler for get method
   * Can be reused by developers that wish to mount handler directly on router
   */
  public getHandler(req: Request, res: Response, next: NextFunction) {
    getLogger().debug('Api get method called',
      { object: this.apiPrefix, params: req.params });

    if (!req.params.id) {
      const error = new ApiError(errorCodes.MISSING_ID, 'Missing id parameter', 400);
      return next(error);
    }

    return this.repository.get(req.params.id).then(function(data) {
      res.json(data);
    }).catch(next);
  }

  /**
   * Handler for create method
   * Can be reused by developers that wish to mount handler directly on router
   */
  public postHandler(req: Request, res: Response, next: NextFunction) {
    getLogger().debug('Api create method called',
      { object: this.apiPrefix, body: req.body });

    if (!req.body) {
      const error = new ApiError(errorCodes.CLIENT_ERROR, 'Missing request body', 400);
      return next(error);
    }

    return this.repository.create(req.body).then(function(data) {
      res.json(data);
    }).catch(next);
  }

  /**
   * Delete handler
   * Can be reused by developers that wish to mount handler directly on router
   */
  public deleteHandler(req: Request, res: Response, next: NextFunction) {
    getLogger().debug('Api delete method called',
      { object: this.apiPrefix, params: req.params });

    if (!req.params.id) {
      const error = new ApiError(errorCodes.MISSING_ID, 'Missing id parameter');
      return next(error);
    }

    this.repository.delete(req.params.id).then(function() {
      // HTTP 204: No Content
      res.status(204).end();
    }).catch(next);
  }

  /**
   * Update handler
   * Can be reused by developers that wish to mount handler directly on router
   */
  public putHandler(req: Request, res: Response, next: NextFunction) {
    getLogger().debug('Api update method called',
      { object: this.apiPrefix, body: req.body });

    if (!req.body) {
      const error = { code: errorCodes.CLIENT_ERROR, message: 'Missing request body' };
      next(error);
    }

    this.repository.update(req.body).then(function(data) {
      res.json(data);
    }).catch(next);
  }

  /**
   * Build all CRUD routes for `apiPrefix`
   *
   * @param router - router used to attach api
   * @param repository - repository to retrieve data
   * @param apiPrefix - prefix to mount api in URI path. For example `/prefix/:id`
   */
  public applyAllRoutes() {
    const idRoute = this.router.route('/' + this.apiPrefix + '/:id');
    const objectRoute = this.router.route('/' + this.apiPrefix + '/');
    getLogger().info('REST api initialization', this.apiPrefix);

    objectRoute.get(this.listHandler.bind(this));
    objectRoute.post(this.postHandler.bind(this));
    objectRoute.put(this.putHandler.bind(this));
    idRoute.get(this.getHandler.bind(this));
    idRoute.delete(this.deleteHandler.bind(this));
  }
}
