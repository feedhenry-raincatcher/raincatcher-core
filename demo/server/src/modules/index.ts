import { EndpointSecurity } from '@raincatcher/auth-passport';
import { BunyanLogger, Logger } from '@raincatcher/logger';
import * as express from 'express';
import EnvironmentConfig, { CloudAppConfig, Config } from '../util/config';
import { connect as syncConnector } from './datasync/Connector';
import { router as syncRouter } from './datasync/Router';
import { init as initKeycloak } from './keycloak';
import { init as authInit } from './passport-auth';

const appConfig: Config<CloudAppConfig> = new EnvironmentConfig<CloudAppConfig>();
const config = appConfig.getConfig();

export let securityMiddleware: EndpointSecurity;
export let logger: Logger;

// Setup all modules
export function setupModules(app: express.Express) {
  loggerSetup();
  syncSetup(app);
  securitySetup(app);
}

function loggerSetup() {
  logger = new BunyanLogger({ name: 'Demo Application' });
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
    logger.info('Connected', {tag: 'demo:server:src:modules'});
  }).catch(function(err: any) {
    logger.error('Failed to initialize sync', err, {tag: 'demo:server:src:modules'});
  });
}
