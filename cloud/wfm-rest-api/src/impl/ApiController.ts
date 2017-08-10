import { getLogger } from '@raincatcher/logger';
import * as express from 'express';
import { ApiError } from '../data-api/ApiError';
import { CrudRepository } from '../data-api/CrudRepository';
import { defaultPaginationEngine } from '../data-api/PaginationEngine';

/**
 * Generic controller that can be used to create API for specific objects
 */
export class ApiController {
  constructor(router: express.Router, service: CrudRepository, readonly apiPrefix: string) {
    getLogger().info('REST api initialization', apiPrefix);
    this.buildRoutes(router, service, apiPrefix);
  }
  /**
   * Build routes for specific element of api
   *
   * @param router - router used to attach api
   * @param service - service to retrieve data
   * @param apiPrefix - prefix to mount api in URI path. For example `/prefix/:id`
   */
  public buildRoutes(router: express.Router, service: CrudRepository, apiPrefix: string) {
    const idRoute = router.route('/' + apiPrefix + '/:id');
    const objectRoute = router.route('/' + apiPrefix + '/');

    objectRoute.get(function(req: express.Request, res: express.Response) {
      getLogger().debug('Api list method called',
        { object: apiPrefix, body: req.query });

      const page = defaultPaginationEngine.buildRequestFromQuery(req.query);
      const objectList = service.list(req.query.filter, page).then(function(data) {
        res.send(data);
      }).catch(function(err) {
        getLogger().error('List error', { err, obj: req.body });
        const error: ApiError = { code: 'DBError', message: 'Failed to list objects' };
        res.status(500).json(error);
      });
    });

    objectRoute.post(function(req: express.Request, res: express.Response) {
      getLogger().debug('Api create method called',
        { object: apiPrefix, body: req.body });

      if (!req.body) {
        const error: ApiError = { code: 'MissingData', message: 'Missing request body' };
        return res.status(400).json(error);
      }

      service.create(req.body).then(function() {
        res.send();
      }).catch(function(err) {
        getLogger().error('Create error', { err, obj: req.body });
        const error: ApiError = { code: 'DBError', message: 'Failed to save object' };
        res.status(500).json(error);
      });
    });

    objectRoute.put(function(req: express.Request, res: express.Response) {
      getLogger().debug('Api update method called',
        { object: apiPrefix, body: req.body });

      if (!req.body) {
        const error: ApiError = { code: 'MissingData', message: 'Missing request body' };
        return res.status(400).json(error);
      }

      service.update(req.body).then(function(data) {
        res.send();
      }).catch(function(err) {
        getLogger().error('Update error', { err, obj: req.body });
        const error: ApiError = { code: 'DBError', message: 'Failed to update object' };
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

      service.get(req.params.id).then(function(data) {
        res.send(data);
      }).catch(function(err) {
        getLogger().error('Get error', { err, obj: req.body });
        const error: ApiError = { code: 'DBError', message: 'Failed to get object' };
        res.status(500).json(error);
      });
    });

    idRoute.delete(function(req: express.Request, res: express.Response) {
      getLogger().debug('Api delete method called',
        { object: apiPrefix, params: req.params });

      if (!req.params.id) {
        const error: ApiError = { code: 'MissingId', message: 'Missing id parameter' };
        return res.status(400).json(error);
      }

      service.delete(req.params.id).then(function(data) {
        res.send(data);
      }).catch(function(err) {
        getLogger().error('Delete error', { err, obj: req.body });
        const error: ApiError = { code: 'DBError', message: 'Failed to delete object' };
        res.status(500).json(error);
      });
    });
  }
}
