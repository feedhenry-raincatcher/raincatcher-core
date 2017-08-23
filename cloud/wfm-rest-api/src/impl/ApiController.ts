import { getLogger } from '@raincatcher/logger';
import * as Bluebird from 'bluebird';
import * as express from 'express';
import { NextFunction, Request, RequestHandler, Response, Router } from 'express';
import { ApiError } from '../data-api/ApiError';
import { defaultPaginationEngine } from '../data-api/MongoPaginationEngine';
import { PagingDataRepository } from '../data-api/PagingDataRepository';
import * as errorCodes from './ErrorCodes';

/**
 * Generic controller that can be used to create API for specific objects
 */
export class ApiController<T> {
  constructor(readonly repository: PagingDataRepository<T>) {
  }

  /**
   * Handler for list method
   * Can be reused by developers that wish to mount handler directly on router
   */
  public listHandler(req: Request) {
    getLogger().debug('Api list method called', { body: req.query });
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
        return Bluebird.reject(error);
      }
    }
    return this.repository.list(filter, page);
  }

  /**
   * Handler for get method
   * Can be reused by developers that wish to mount handler directly on router
   */
  public getHandler(req: Request) {
    getLogger().debug('Api get method called', { params: req.params });

    if (!req.params.id) {
      const error = new ApiError(errorCodes.MISSING_ID, 'Missing id parameter', 400);
      return Bluebird.reject(error);
    }

    return this.repository.get(req.params.id);
  }

  /**
   * Handler for create method
   * Can be reused by developers that wish to mount handler directly on router
   */
  public postHandler(req: Request) {
    getLogger().debug('Api create method called', { body: req.body });

    if (!req.body) {
      const error = new ApiError(errorCodes.CLIENT_ERROR, 'Missing request body', 400);
      return Bluebird.reject(error);
    }

    return this.repository.create(req.body);
  }

  /**
   * Delete handler
   * Can be reused by developers that wish to mount handler directly on router
   */
  public deleteHandler(req: Request) {
    getLogger().debug('Api delete method called', { params: req.params });

    if (!req.params.id) {
      const error = new ApiError(errorCodes.MISSING_ID, 'Missing id parameter', 400);
      return Bluebird.reject(error);
    }

    return this.repository.delete(req.params.id)
      // Return nothing to imply 204 http status
      .then(() => undefined);
  }

  /**
   * Update handler
   * Can be reused by developers that wish to mount handler directly on router
   */
  public putHandler(req: Request) {
    getLogger().debug('Api update method called', { body: req.body });

    if (!req.body) {
      const error = new ApiError(errorCodes.CLIENT_ERROR, 'Missing request body', 204);
      return Bluebird.reject(error);
    }

    const data = req.body;
    const id = req.params.id;
    if (!id) {
      const error = new ApiError(errorCodes.CLIENT_ERROR, 'Missing entity id for update', 204);
      return Bluebird.reject(error);
    }

    data.id = id;

    return this.repository.update(data);
  }

  /**
   * Handler for list by filter method
   * Can be reused by developers that wish to mount handler directly on router
   */
  public listByFilterHandler(req: Request) {
    getLogger().debug('Api list by filter method called', { query: req.query });
    const page = defaultPaginationEngine.buildRequestFromQuery(req.query);
    let filter = {};

    if (req.query.filter) {
      let parsedFilter;
      try {
        parsedFilter = JSON.parse(req.query.filter);
      } catch (err) {
        getLogger().error('Invalid filter passed');
        const error = new ApiError(errorCodes.CLIENT_ERROR, 'Invalid filter query parameter', 400);
        return Bluebird.reject(error);
      }

      if (parsedFilter) {
        const propertiesToFilter = new Array();
        for (const property in parsedFilter) {
          if (property) {
            const propertyToFilter = {
              [property]: {
                $regex: '.*' + parsedFilter[property] + '.*',
                $options: 'i'
              }
            };

            propertiesToFilter.push(propertyToFilter);
          }
        }

        if (propertiesToFilter.length > 0) {
          filter = {
            $or: propertiesToFilter
          };
        }
      }
    }

    return this.repository.list(filter, page);
  }

  /**
   * Build all CRUD routes
   *
   * @return router containing all routes
   */
  public buildRouter(): Router {
    const router = express.Router();
    router.route('/')
      .get(this.buildExpressHandler(this.listHandler))
      .post(this.buildExpressHandler(this.postHandler));
    router.route('/search')
      .get(this.buildExpressHandler(this.listByFilterHandler));
    router.route('/:id')
      .get(this.buildExpressHandler(this.getHandler))
      .delete(this.buildExpressHandler(this.deleteHandler))
      .put(this.buildExpressHandler(this.putHandler));

    return router;
  }

  private buildExpressHandler(handlerFn: (this: this, req: Request) => Bluebird<T | T[] | undefined>): RequestHandler {
    return (req, res, next) => handlerFn.bind(this)(req)
      .then((data: T | T[] | undefined) => data ? res.json(data) : res.status(204).end())
      .catch(next);
  }
}
