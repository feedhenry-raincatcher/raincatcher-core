import { EndpointSecurity } from '@raincatcher/express-auth';
import * as express from 'express';
import * as session from 'express-session';

import appConfig from '../../util/Config';

// tslint:disable-next-line:no-var-requires
const Keycloak = require('keycloak-connect');
import sessionOptions from '../SessionOptions';

const config = appConfig.getConfig();

export class KeycloakSecurity implements EndpointSecurity {
  // Add typescript definitions
  private keycloak: any;

  public init(app: express.Router, sessionOpts: session.SessionOptions): void {
    // Express Session Configuration.
    app.use(session(sessionOpts));

    // Create a session store
    const memoryStore = new session.MemoryStore();
    this.keycloak = new Keycloak({ store: memoryStore }, config.security.keycloak);
    app.use(this.keycloak.middleware({logout: '/logout'}));
  }
  public protect(role?: string | undefined): express.Handler {
    return this.keycloak.protect(role);
  }
}

export function init(app: express.Router) {
  const securityImpl = new KeycloakSecurity();
  securityImpl.init(app, sessionOptions);
  return securityImpl;
}
