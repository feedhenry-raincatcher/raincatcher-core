import { getLogger } from '@raincatcher/logger';
import * as express from 'express';
import { ApiError } from '../data-api/ApiError';
import { CrudRepository } from '../data-api/CrudRepository';
import { defaultPaginationEngine } from '../data-api/MongoPaginationEngine';
import * as errorCodes from './ErrorCodes';

/**
 * Generic controller that can be used to create API for specific objects
 */
export class ApiController {
  constructor(router: express.Router, repository: CrudRepository, readonly apiPrefix: string) {
    getLogger().info('REST api initialization', apiPrefix);
    this.buildRoutes(router, repository, apiPrefix);
  }
  /**
   * Build routes for specific element of api
   *
   * @param router - router used to attach api
   * @param repository - repository to retrieve data
   * @param apiPrefix - prefix to mount api in URI path. For example `/prefix/:id`
   */
  protected buildRoutes(router: express.Router, repository: CrudRepository, apiPrefix: string) {
    const self = this;
    const idRoute = router.route('/' + apiPrefix + '/:id');
    const objectRoute = router.route('/' + apiPrefix + '/');

    objectRoute.get(function(req: express.Request, res: express.Response) {
      getLogger().debug('Api list method called',
        { object: apiPrefix, body: req.query });
      const page = defaultPaginationEngine.buildRequestFromQuery(req.query);
      let filter = {};
      if (req.query.filter) {
        try {
          filter = JSON.parse(req.query.filter);
        } catch (err) {
          getLogger().debug('Invalid filter passed');
        }
      }
      if (req.body.filter) {
        filter = req.body.filter;
      }
      const objectList = repository.list(filter, page).then(function(data) {
        res.send(data);
      }).catch(function(err: ApiError) {
        self.errorHandler(req, res, err);
      });
    });

    objectRoute.post(function(req: express.Request, res: express.Response) {
      getLogger().debug('Api create method called',
        { object: apiPrefix, body: req.body });

      if (!req.body) {
        const error: ApiError = { code: errorCodes.CLIENT_ERROR, message: 'Missing request body' };
        return res.status(400).json(error);
      }

      repository.create(req.body).then(function() {
        res.send();
      }).catch(function(err: ApiError) {
        self.errorHandler(req, res, err);
      });
    });

    objectRoute.put(function(req: express.Request, res: express.Response) {
      getLogger().debug('Api update method called',
        { object: apiPrefix, body: req.body });

      if (!req.body) {
        const error = { code: errorCodes.CLIENT_ERROR, message: 'Missing request body' };
        return res.status(400).json(error);
      }

      repository.update(req.body).then(function(data) {
        res.send();
      }).catch(function(err: ApiError) {
        getLogger().error('Update error', { err: err.message, obj: req.body });
        const error: ApiError = { code: errorCodes.DB_ERROR, message: 'Failed to update object' };
        res.status(500).json(error);
      });
    });

    idRoute.get(function(req: express.Request, res: express.Response) {
      getLogger().debug('Api get method called',
        { object: apiPrefix, params: req.params });

      if (!req.params.id) {
        const error: ApiError = { code: 'MissingId', message: 'Missing id parameter' };
        return res.status(400).json(error);
      }

      repository.get(req.params.id).then(function(data) {
        res.send(data);
      }).catch(function(err: ApiError) {
        self.errorHandler(req, res, err);
      });
    });

    idRoute.delete(function(req: express.Request, res: express.Response) {
      getLogger().debug('Api delete method called',
        { object: apiPrefix, params: req.params });

      if (!req.params.id) {
        const error: ApiError = { code: 'MissingId', message: 'Missing id parameter' };
        return res.status(400).json(error);
      }

      repository.delete(req.params.id).then(function(data) {
        res.send(data);
      }).catch(function(err) {
        self.errorHandler(req, res, err);
      });
    });
  }
  protected errorHandler(req: express.Request, res: express.Response, error: ApiError) {
    getLogger().error('Api error', { error, obj: req.body });
    res.status(500).json(error);
  }
}
