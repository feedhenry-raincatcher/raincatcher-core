import { EndpointSecurity } from '@raincatcher/auth-passport';
import { getLogger } from '@raincatcher/logger';
import { WfmRestApi } from '@raincatcher/wfm-rest-api';
import * as Promise from 'bluebird';
import * as express from 'express';
import { Db } from 'mongodb';
import appConfig from '../util/Config';
import { connect as syncConnector } from './datasync/Connector';
import { router as syncRouter } from './datasync/Router';
import initData from './demo-data';
import { init as initKeycloak } from './keycloak';
import { init as authInit } from './passport-auth';

const config = appConfig.getConfig();

export let securityMiddleware: EndpointSecurity;

// Setup all modules
export function setupModules(app: express.Express) {
  const connectionPromise = syncSetup(app);
  securitySetup(app);
  apiSetup(app, connectionPromise);
  demoDataSetup(connectionPromise);
}

function securitySetup(app: express.Express) {
  // Use Keycloak if Keycloak configuration is provided
  const useKeycloak = config.keycloakConfig || false;
  if (useKeycloak) {
    // user keycloak authentication
    setupKeycloakSecurity(app);
  } else {
    // resort to passport authentication
    setupPassportSecurity(app);
  }
}

function setupPassportSecurity(app: express.Express) {
  securityMiddleware = authInit(app);
}

function setupKeycloakSecurity(app: express.Express) {
  securityMiddleware = initKeycloak(app);
}

function syncSetup(app: express.Express) {
  // Mount api
  app.use('/sync', syncRouter);
  // Connect sync
  return syncConnector().then(function(connections: { mongo: Db, redis: any }) {
    getLogger().info('Sync started');
    return connections.mongo;
  }).catch(function(err: any) {
    getLogger().error('Failed to initialize sync', err);
  });
}

function apiSetup(app: express.Express, connectionPromise: Promise<any>) {
  const router: express.Router = express.Router();
  // Mount api
  const api = new WfmRestApi();
  const role = config.security.apiRole;
  app.use('/api', securityMiddleware.protect(role), api.createWFMRouter());
  connectionPromise.then(function(db: Db) {
    api.setDb(db);
  });
}

function demoDataSetup(connectionPromise: Promise<Db>) {
  connectionPromise.then(function(mongo: Db) {
    if (config.seedDemoData) {
      initData(mongo);
    }
  });
}
