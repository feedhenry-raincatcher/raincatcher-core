import { getLogger } from '@raincatcher/logger';
import * as express from 'express';
import { DataService } from './DataService';

export class DataController {
  constructor(router: express.Router, service: DataService, readonly apiPrefix: string) {
    getLogger().info('REST api initialization', apiPrefix);
    this.buildRoutes(router, service, apiPrefix);
  }
  public buildRoutes(router: express.Router, service: DataService, apiPrefix: string) {
    const idRoute = router.route(apiPrefix + '/:id');
    const objectRoute = router.route(apiPrefix + '/');

    objectRoute.get(function(req: express.Request, res: express.Response) {
      const objectList = service.list();
      res.json(objectList);
    });

    objectRoute.post(function(req: express.Request, res: express.Response) {
      res.json(service.create(req.body));
    });

    objectRoute.put(function(req: express.Request, res: express.Response) {
      res.json(service.update(req.body));
    });

    idRoute.get(function(req: express.Request, res: express.Response) {
      res.json(service.get(req.params.id));
    });

    idRoute.delete(function(req: express.Request, res: express.Response) {
      res.json(service.delete(req.params.id));
    });
  }
}
