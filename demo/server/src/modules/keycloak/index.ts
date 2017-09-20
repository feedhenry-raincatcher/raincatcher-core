import { EndpointSecurity } from '@raincatcher/express-auth';
import * as express from 'express';
import * as session from 'express-session';
import appConfig from '../../util/Config';
import globalSessionOptions from '../session/RedisSession';

// tslint:disable-next-line:no-var-requires
const Keycloak = require('keycloak-connect');

const config = appConfig.getConfig();

export class KeycloakSecurity implements EndpointSecurity {
  // Add typescript definitions
  private keycloak: any;

  public init(app: express.Router, sessionOpts: session.SessionOptions): void {
    // Express Session Configuration.
    app.use(session(sessionOpts));

    this.keycloak = new Keycloak({ store: sessionOpts.store }, config.security.keycloak.realm);
    app.use(this.keycloak.middleware({ logout: '/logout' }));
  }
  public protect(role?: string | undefined): express.Handler {
    return this.keycloak.protect(role);
  }
}

export function init(app: express.Router) {
  const securityImpl = new KeycloakSecurity();
  securityImpl.init(app, globalSessionOptions);
  return securityImpl;
}
