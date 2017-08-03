import { EndpointSecurity } from '@raincatcher/auth-passport';
import { getLogger } from '@raincatcher/logger';
import * as express from 'express';
import appConfig from '../util/config';
import { connect as syncConnector } from './datasync/Connector';
import { router as syncRouter } from './datasync/Router';
import { init as initKeycloak } from './keycloak';
import { init as authInit } from './passport-auth';

const config = appConfig.getConfig();

export let securityMiddleware: EndpointSecurity;

// Setup all modules
export function setupModules(app: express.Express) {
  syncSetup(app);
  securitySetup(app);
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
  syncConnector().then(function() {
    getLogger().info('Sync started');
  }).catch(function(err: any) {
    getLogger().error('Failed to initialize sync', err);
  });
}
