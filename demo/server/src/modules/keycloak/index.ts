// tslint:disable-next-line:no-reference
/// <reference path="./keycloak.d.ts" />

import * as express from 'express';
import * as session from 'express-session';
import * as Keycloak from 'keycloak-connect';
import EnvironmentConfig, { CloudAppConfig, Config } from '../../util/config';
import sessionOpts from '../sessionOpts';

const appConfig: Config<CloudAppConfig> = new EnvironmentConfig<CloudAppConfig>();
const config = appConfig.getConfig();

export function init(app: express.Express) {

  // Express Session Configuration.
  app.use(session(sessionOpts));

  // Create a session store
  const memoryStore = new session.MemoryStore();
  const keycloak = new Keycloak({ store: memoryStore }, config.keycloakConfig);

  // Use keycloak middleware & define applications logout route
  app.use(keycloak.middleware({logout: '/logout'}));

  // return the keycloak middleware
  return keycloak;
}
