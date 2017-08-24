import * as express from 'express';
import { SessionOptions } from 'express-session';

/**
 * Security interface for Raincatcher authentication middleware
 * Contains all the methods that should be used to protect express routes.
 */
export interface EndpointSecurity {

  /**
   * Initializes an Express application to use passport and express-session
   *
   * @param app - An express application
   * @param sessionOpts - Session options to be used by express-session
   */
  init(app: express.Express, sessionOpts: SessionOptions): void;

  /**
   * Function which checks if the user requesting access to the resource is authenticated and authorized to
   * access the resource. Redirects to the login page if user is not authenticated or returns a status of 403
   * if the user does not have the required role.
   *
   * @param role - Role which the user needs in order to access this resource
   */
  protect(role?: string): express.Handler;

  /**
   * Create middleware for authentication purposes
   * This method wraps `passport.authenticate` to provide middleware for authenticating users.
   *
   * @param redirect - location to redirect after successful authentication
   * @param loginError - location to redirect after failed authentication
   */
  authenticate(redirect: string, loginError: string): express.Handler;
}

export default EndpointSecurity;
