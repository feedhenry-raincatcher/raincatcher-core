import { EndpointSecurity } from '@raincatcher/auth-passport';
import initData from '@raincatcher/demo-data';
import { getLogger } from '@raincatcher/logger';
import { WfmRestApi } from '@raincatcher/wfm-rest-api';
import { User, UserController, UsersRepository } from '@raincatcher/wfm-user';
import * as Promise from 'bluebird';
import * as express from 'express';
import { Db } from 'mongodb';
import appConfig from '../util/Config';
import { connect as syncConnector } from './datasync/Connector';
import { router as syncRouter } from './datasync/Router';
import { init as initKeycloak } from './keycloak';
import { init as authInit } from './passport-auth';
import {StaticUsersRepository} from './wfm-user/StaticUsersRepository';

const config = appConfig.getConfig();

export let securityMiddleware: EndpointSecurity;

// Setup all modules
export function setupModules(app: express.Express) {
  securitySetup(app);
  const connectionPromise = syncSetup(app);
  wfmApiSetup(app, connectionPromise);
  userApiSetup(app);
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

function userApiSetup(app: express.Express) {
  const usersRepo = new StaticUsersRepository();
  const userController = new UserController(usersRepo);
  const role = config.security.adminRole;
  app.use('/api/users', securityMiddleware.protect(role), userController.buildRouter());
}

function setupPassportSecurity(app: express.Express) {
  securityMiddleware = authInit(app);
}

function setupKeycloakSecurity(app: express.Express) {
  securityMiddleware = initKeycloak(app);
}

function syncSetup(app: express.Express) {
  // Mount api
  const role = config.security.userRole;
  // app.use('/sync', securityMiddleware.protect(role));
  app.use('/sync', syncRouter);
  // Connect sync
  return syncConnector().then(function(connections: { mongo: Db, redis: any }) {
    getLogger().info('Sync started');
    return connections.mongo;
  }).catch(function(err: any) {
    getLogger().error('Failed to initialize sync', err);
  });
}

function wfmApiSetup(app: express.Express, connectionPromise: Promise<any>) {
  // Mount api
  const api = new WfmRestApi();
  const role = config.security.adminRole;
  app.use('/api', securityMiddleware.protect(role));
  app.use('/api', api.createWFMRouter());
  connectionPromise.then(function(mongo: Db) {
    // Fix compilation problem with different version of Db.
    api.setDb(mongo as any);
  });
}

function demoDataSetup(connectionPromise: Promise<Db>) {
  connectionPromise.then(function(mongo: Db) {
    if (config.seedDemoData) {
      initData(mongo);
    }
  });
}
