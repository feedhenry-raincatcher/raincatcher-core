/// <reference path="./keycloak.d.ts" />

import * as express from 'express';
import * as session from 'express-session';
import * as Keycloak from 'keycloak-connect'
import sessionOpts from '../sessionOpts';

export function init(app: express.Express) {

  // Express Session Configuration.
  app.use(session(sessionOpts));


  // Create a session store
  var memoryStore = new session.MemoryStore();
  var keycloak = new Keycloak({ store: memoryStore });

  // Use keycloak middleware & define applications logout route
  app.use(keycloak.middleware( { logout: '/logout'} ));

  // return the keycloak middleware
  return keycloak;
}