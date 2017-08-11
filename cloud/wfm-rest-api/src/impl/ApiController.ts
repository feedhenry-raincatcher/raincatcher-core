import { getLogger } from '@raincatcher/logger';
import * as express from 'express';
import { ApiError } from '../data-api/ApiError';
import { defaultPaginationEngine } from '../data-api/MongoPaginationEngine';
import { PagingDataRepository } from '../data-api/PagingDataRepository';
import * as errorCodes from './ErrorCodes';

/**
 * Generic controller that can be used to create API for specific objects
 */
export class ApiController {
  constructor(readonly router: express.Router, readonly repository: PagingDataRepository, readonly apiPrefix: string) {
  }

  /**
   * Handler for list method
   * Can be reused by developers that wish to mount handler directly on router
   */
  public listHandler(req: express.Request, res: express.Response) {
    const self = this;
    getLogger().debug('Api list method called',
      { object: self.apiPrefix, body: req.query });
    const page = defaultPaginationEngine.buildRequestFromQuery(req.query);
    let filter = {};
    if (req.query.filter) {
      try {
        filter = JSON.parse(req.query.filter);
      } catch (err) {
        getLogger().debug('Invalid filter passed');
        const error: ApiError = { code: errorCodes.CLIENT_ERROR, message: 'Invalid filter query parameter' };
        return res.status(400).json(error);
      }
    }
    if (req.body.filter) {
      filter = req.body.filter;
    }
    const objectList = self.repository.list(filter, page).then(function(data) {
      res.json(data);
    }).catch(function(err: ApiError) {
      self.errorHandler(req, res, err);
    });
  }

  /**
   * Handler for get method
   * Can be reused by developers that wish to mount handler directly on router
   */
  public getHandler(req: express.Request, res: express.Response) {
    const self = this;
    getLogger().debug('Api get method called',
      { object: self.apiPrefix, params: req.params });

    if (!req.params.id) {
      const error: ApiError = { code: errorCodes.MISSING_ID, message: 'Missing id parameter' };
      return res.status(400).json(error);
    }

    self.repository.get(req.params.id).then(function(data) {
      res.json(data);
    }).catch(function(err: ApiError) {
      self.errorHandler(req, res, err);
    });
  }

  /**
   * Handler for create method
   * Can be reused by developers that wish to mount handler directly on router
   */
  public postHandler(req: express.Request, res: express.Response) {
    const self = this;
    getLogger().debug('Api create method called',
      { object: self.apiPrefix, body: req.body });

    if (!req.body) {
      const error: ApiError = { code: errorCodes.CLIENT_ERROR, message: 'Missing request body' };
      return res.status(400).json(error);
    }

    self.repository.create(req.body).then(function(data) {
      res.json(data);
    }).catch(function(err: ApiError) {
      self.errorHandler(req, res, err);
    });
  }

  /**
   * Delete handler
   * Can be reused by developers that wish to mount handler directly on router
   */
  public deleteHandler(req: express.Request, res: express.Response) {
    const self = this;
    getLogger().debug('Api delete method called',
      { object: self.apiPrefix, params: req.params });

    if (!req.params.id) {
      const error: ApiError = { code: errorCodes.MISSING_ID, message: 'Missing id parameter' };
      return res.status(400).json(error);
    }

    self.repository.delete(req.params.id).then(function(data) {
      res.json();
    }).catch(function(err) {
      self.errorHandler(req, res, err);
    });
  }

  /**
   * Update handler
   * Can be reused by developers that wish to mount handler directly on router
   */
  public putHandler(req: express.Request, res: express.Response) {
    const self = this;
    getLogger().debug('Api update method called',
      { object: self.apiPrefix, body: req.body });

    if (!req.body) {
      const error = { code: errorCodes.CLIENT_ERROR, message: 'Missing request body' };
      return res.status(400).json(error);
    }

    self.repository.update(req.body).then(function(data) {
      res.json(data);
    }).catch(function(err: ApiError) {
      self.errorHandler(req, res, err);
    });
  }

  /**
   * Build all CRUD routes for `apiPrefix`
   *
   * @param router - router used to attach api
   * @param repository - repository to retrieve data
   * @param apiPrefix - prefix to mount api in URI path. For example `/prefix/:id`
   */
  public applyAllRoutes() {
    const self = this;
    const idRoute = this.router.route('/' + this.apiPrefix + '/:id');
    const objectRoute = this.router.route('/' + this.apiPrefix + '/');
    getLogger().info('REST api initialization', this.apiPrefix);

    objectRoute.get(this.listHandler.bind(this));
    objectRoute.post(this.postHandler.bind(this));
    objectRoute.put(this.putHandler.bind(this));
    idRoute.get(this.getHandler.bind(this));
    idRoute.delete(this.deleteHandler.bind(this));
  }
  protected errorHandler(req: express.Request, res: express.Response, error: ApiError) {
    getLogger().error('Api error', { error, obj: req.body });
    res.status(500).json(error);
  }
}
