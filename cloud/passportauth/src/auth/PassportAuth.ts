import { logger } from '@raincatcher/logger';
import * as express from 'express';
import * as session from 'express-session';
import { SessionOptions } from 'express-session';
import * as passport from 'passport';
import { Strategy } from 'passport-local';
import { UserRepository } from '../user/UserRepository';
import { UserService } from '../user/UserService';

import { defaultStrategy } from './DefaultStrategy';
import { defaultDeserializeUser, defaultSerializeUser } from './UserSerializer';

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

/**
 * Default implementation for passport authentication
 */
export class PassportAuth implements EndpointSecurity {
  protected loginRoute: string;

  // tslint:disable-next-line:max-line-length
  constructor(protected readonly userRepo: UserRepository, protected readonly userService: UserService, loginRoute?: string) {
    this.loginRoute = loginRoute || '/login';
  }

  /**
   * Initializes an Express application to use passport and express-session
   *
   * @param app - An express application
   * @param sessionOpts - Session options to be used by express-session
   */
  public init(app: express.Express, sessionOpts: SessionOptions) {
    logger.info('Initializing express app to use express session and passport', {tag: 'cloud:passportauth:src:auth'});
    app.use(session(sessionOpts));
    app.use(passport.initialize());
    app.use(passport.session());
    this.setup(passport);
  }

  /**
   * Function which checks if the user requesting access to the resource is authenticated and authorized to
   * access the resource. Redirects to the login page if user is not authenticated or returns a status of 403
   * if the user does not have the required role.
   *
   * @param role - Role which the user needs in order to access this resource
   */
  public protect(role?: string) {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
      if (!req.isAuthenticated()) {
        if (req.session) {
          // Used for redirecting to after a successful login when option successReturnToOrRedirect is defined.
          req.session.returnTo = req.originalUrl;
        }
        return res.redirect(this.loginRoute);
      }

      const hasRole = role ? this.userService.hasResourceRole(req.user, role) : true;
      return hasRole ? next() : this.accessDenied(req, res);
    };
  }

  /**
   * Create middleware for authentication purposes
   * This method wraps `passport.authenticate` to provide middleware for authenticating users.
   *
   * @param defaultRedirect - location to redirect after successful authentication
   *                          when login page was loaded directly (without redirect)
   * @param errorRedirect - location to redirect after unsuccessful authentication
   */
  public authenticate(defaultRedirect: string, errorRedirect?: string) {
    return passport.authenticate('local', {
      failureRedirect: errorRedirect,
      successReturnToOrRedirect: defaultRedirect
    });
  }

  /**
   * Handler for access denied responses in the event that a user is not authorized to access
   * a resource. This method can be overridden to provide a custom access denied handler
   */
  public accessDenied(req: express.Request, res: express.Response) {
    res.status(403).send();
  }

  /**
   * Initialized passport configuration.
   * Method can be overridden to provide custom passport setup
   *
   * @param passportApi - passport.js instance
   */
  protected setup(passportApi: passport.Passport) {
    passportApi.use(new Strategy(defaultStrategy(this.userRepo, this.userService)));
    passportApi.serializeUser(defaultSerializeUser);
    passportApi.deserializeUser(defaultDeserializeUser);
  }
}

export default PassportAuth;
