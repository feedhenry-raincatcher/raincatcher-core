import * as express from 'express';
import * as session from 'express-session';

import appConfig from '../../util/Config';
import sessionOpts from '../SessionOptions';

// tslint:disable-next-line:no-var-requires
const Keycloak = require('keycloak-connect');

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
