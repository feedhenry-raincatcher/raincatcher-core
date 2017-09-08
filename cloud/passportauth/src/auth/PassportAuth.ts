import { getLogger } from '@raincatcher/logger';
import * as express from 'express';
import * as session from 'express-session';
import { SessionOptions } from 'express-session';
import * as jwt from 'jsonwebtoken';
import * as passport from 'passport';
import { AuthenticateOptions } from 'passport';
import { ExtractJwt, Strategy as JwtStrategy, StrategyOptions as JwtOptions } from 'passport-jwt';
import { Strategy } from 'passport-local';
import { CONSTANTS } from '../constants';
import { UserRepository } from '../user/UserRepository';
import { UserService } from '../user/UserService';

import { EndpointSecurity } from '@raincatcher/express-auth';
import { jwtStrategy, webStrategy } from './DefaultStrategies';
import { defaultDeserializeUser, defaultSerializeUser } from './UserSerializer';

/**
 * Default implementation for passport authentication
 */
export class PassportAuth implements EndpointSecurity {
  protected passport: passport.Passport = new passport.Passport();
  protected jwtOpts: JwtOptions;

  // tslint:disable-next-line:max-line-length
  constructor(protected readonly userRepo: UserRepository, protected readonly userService: UserService) {
  }

  /**
   * Initializes an Express application to use passport.
   * Note: If the session options are not defined, session based authentication will not be used.
   *
   * @param app - An express application
   * @param sessionOpts - Session options to be used by express-session
   * @param secret - Secret to be used for Passport's JWT strategy
   */
  public init(app: express.Router, sessionOpts?: SessionOptions, secret?: any) {
    getLogger().info('Initializing express app to use passport');
    if (sessionOpts) {
      app.use(session(sessionOpts));
      app.use(this.passport.initialize());
      app.use(this.passport.session());
      this.setupCookie(this.passport);
    } else {
      this.jwtOpts = {
        jwtFromRequest: ExtractJwt.fromAuthHeader(),
        secretOrKey: secret || CONSTANTS.defaultSecret
      };
      app.use(this.passport.initialize());
      this.setupToken(this.passport, this.jwtOpts);
    }

  }

  /**
   * Function which checks if the user requesting access to the resource is authenticated and authorized to
   * access the resource. Returns a status of 401 if the user is not authenticated and returns a status of 403
   * if the user does not have the required role.
   *
   * @param role - Role which the user needs in order to access this resource
   */
  public protect(role?: string) {
    const self = this;
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
      let hasRole;

      if (req.headers && req.headers.authorization) {
        getLogger().info('Token based authentication and authorization');
        const token = req.headers.authorization.toString().substring(4);
        try {
          const user = jwt.verify(token, this.jwtOpts.secretOrKey);
          hasRole = role ? this.userService.hasResourceRole(user, role) : true;
          return hasRole ? this.passport.authenticate('jwt', {session: false})(req, res, next) :
                           self.accessDenied(req, res);
        } catch (error) {
          return res.status(401).json(new Error(error));
        }
      } else {
        getLogger().info('Session based authentication and authorization');
        if (!req.isAuthenticated()) {
          if (req.session) {
            // Used for redirecting to after a successful login when option successReturnToOrRedirect is defined.
            req.session.returnTo = self.setReturnToUrl(req);
            req.session.clientURL = req.session.returnTo;
          }
          return res.status(401).send();
        }

        hasRole = role ? this.userService.hasResourceRole(req.user, role) : true;
        return hasRole ? next() : self.accessDenied(req, res);
      }
    };
  }

  /**
   * Creates a middleware for authentication purposes.
   * This method wraps `passport.authenticate` to provide a middleware for authenticating users.
   * It also includes a check if the user is already authenticated. If the user is already
   * authenticated, it redirects back to the application, otherwise, it proceeds to authenticate
   * the user.
   *
   * @param strategy - Strategy to be used by Passport's authenticate function
   */
  public authenticate(strategy: string, options?: AuthenticateOptions) {
    const self = this;
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
      if (!req.headers.authorization && req.isAuthenticated() && req.session) {
        const redirectUrl = req.session.returnTo || req.session.clientURL;
        if (redirectUrl) {
          return res.redirect(redirectUrl);
        }
        return next();
      }

      if (options) {
        return this.passport.authenticate(strategy, options)(req, res, next);
      }
      return this.passport.authenticate(strategy)(req, res, next);
    };
  }

  /**
   * Handler for access denied responses in the event that a user is not authorized to access
   * a resource. This method can be overridden to provide a custom access denied handler
   */
  protected accessDenied(req: express.Request, res: express.Response) {
    res.status(403).send();
  }

  /**
   * Sets the url to return to after successful login.
   * This method can be overridden to provide a custom URL to return to
   */
  protected setReturnToUrl(req: express.Request) {
    if (req.headers && req.headers.referer) {
      return req.headers.referer;
    }
    return req.originalUrl;
  }

  /**
   * Sets up the local strategy, serializer and deserializer to be used by Passport's cookie
   * based authentication.
   * Method can be overridden to provide custom passport setup
   *
   * @param passportApi - passport.js instance
   */
  protected setupCookie(passportApi: passport.Passport) {
    getLogger().info('Setting up configuration for cookie based authentication');
    passportApi.use(new Strategy(webStrategy(this.userRepo, this.userService)));
    passportApi.serializeUser(defaultSerializeUser);
    passportApi.deserializeUser(defaultDeserializeUser);
  }

  /**
   * Sets up the JWT strategy, serializer and deserializer to be used by Passport's token
   * based authentication.
   * Method can be overridden to provide custom passport setup
   *
   * @param passportApi - passport.js instance
   * @param jwtOpts - Options used for Passport's JWT strategy
   */
  protected setupToken(passportApi: passport.Passport, jwtOpts: JwtOptions) {
    getLogger().info('Setting up configuration for token based authentication');
    passportApi.use(new JwtStrategy(jwtOpts, jwtStrategy(this.userRepo)));
    passportApi.serializeUser(defaultSerializeUser);
    passportApi.deserializeUser(defaultDeserializeUser);
  }
}

export default PassportAuth;
