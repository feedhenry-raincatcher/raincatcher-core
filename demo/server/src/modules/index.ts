import { SyncExpressMiddleware, userMapperMiddleware } from '@raincatcher/datasync-cloud';
import SyncServer, { SyncApi, SyncOptions } from '@raincatcher/datasync-cloud';
import { EndpointSecurity } from '@raincatcher/express-auth';
import { createRouter as createFileRouter, FileMetadata, FileStorage, GridFsStorage } from '@raincatcher/filestore';
import { getLogger } from '@raincatcher/logger';
import initData from '@raincatcher/wfm-demo-data';
import { WfmRestApi } from '@raincatcher/wfm-rest-api';
import { User, UserController, UsersRepository } from '@raincatcher/wfm-user';
import * as Promise from 'bluebird';
import * as express from 'express';
import { SessionOptions } from 'express-session';
import { Db } from 'mongodb';
import appConfig from '../util/Config';
import { connect as syncConnector } from './datasync/Connector';
import { init as initKeycloak } from './keycloak';
import { init as authInit } from './passport-auth';
import globalSessionOptions from './session/RedisSession';
import { StaticUsersRepository } from './wfm-user/StaticUsersRepository';

const config = appConfig.getConfig();

export let portalsecurityMiddleware: EndpointSecurity;
export let mobileSecurityMiddleware: EndpointSecurity;

/**
 * Setup modules for the mobile and portal app and mount it to
 * the express app.
 */
export function setupModules(app: express.Express) {
  const mobileApp = express.Router();
  mobileSecurityMiddleware = securitySetup(mobileApp);
  const connectionPromise = syncSetup(mobileApp);
  demoDataSetup(connectionPromise);
  fileStoreSetup(mobileApp, mobileSecurityMiddleware);

  const portalApp = express.Router();
  portalsecurityMiddleware = securitySetup(portalApp, globalSessionOptions);
  wfmApiSetup(portalApp, connectionPromise);
  userApiSetup(portalApp);

  app.use(portalApp);
  app.use(mobileApp);
}

function securitySetup(app: express.Router, sessionOptions?: SessionOptions) {
  if (config.security.keycloak.realm) {
    return setupKeycloakSecurity(app);
  } else {
    return setupPassportSecurity(app, sessionOptions);
  }
}

function userApiSetup(app: express.Router) {
  const usersRepo = new StaticUsersRepository();
  const userController = new UserController(usersRepo);
  const role = config.security.adminRole;
  app.use('/api/users', portalsecurityMiddleware.protect(role), userController.buildRouter());
}

function setupPassportSecurity(app: express.Router, sessionOptions?: SessionOptions) {
  return authInit(app, sessionOptions);
}

function setupKeycloakSecurity(app: express.Router) {
  return initKeycloak(app);
}

function syncSetup(app: express.Router) {
  // Mount api
  const role = config.security.userRole;
  // Mount router at specific location
  const middleware: SyncExpressMiddleware = new SyncExpressMiddleware('');
  const syncRouter = middleware.createSyncExpressRouter();

  app.use('/sync', mobileSecurityMiddleware.protect(role));
  app.use('/sync', userMapperMiddleware('workorders', 'assignee', true));
  app.use('/sync', syncRouter);

  return syncConnector().then(function(connections: { mongo: Db, redis: any }) {
    getLogger().info('Sync started');
    return connections.mongo;
  });
}

function wfmApiSetup(app: express.Router, connectionPromise: Promise<any>) {
  // Mount api
  const api = new WfmRestApi();
  const role = config.security.adminRole;
  app.use('/api', portalsecurityMiddleware.protect(role));
  app.use('/api', api.createWFMRouter());
  connectionPromise.then(function(mongo: Db) {
    // Fix compilation problem with different version of Db.
    api.setDb(mongo as any);
  });
}

function fileStoreSetup(app: express.Router, securityMiddleware: EndpointSecurity) {
  const fileStore: FileStorage = new GridFsStorage(config.mongodb.url);
  const role = config.security.userRole;
  app.use('/file', securityMiddleware.protect(role), createFileRouter(fileStore));
}

function demoDataSetup(connectionPromise: Promise<Db>) {
  connectionPromise.then(function(mongo: Db) {
    if (config.seedDemoData) {
      initData(mongo);
    }
  }).catch(function() {
    getLogger().error('Failed to connect to a database');
  });
}
