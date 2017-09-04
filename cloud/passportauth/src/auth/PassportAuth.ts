import { getLogger } from '@raincatcher/logger';
import * as express from 'express';
import * as session from 'express-session';
import { SessionOptions } from 'express-session';
import * as jwt from 'jsonwebtoken';
import * as passport from 'passport';
import { AuthenticateOptions } from 'passport';
import { ExtractJwt, Strategy as JwtStrategy, StrategyOptions as JwtOptions } from 'passport-jwt';
import { Strategy } from 'passport-local';
import { UserRepository } from '../user/UserRepository';
import { UserService } from '../user/UserService';

import { EndpointSecurity } from '@raincatcher/express-auth';
import { defaultStrategy } from './DefaultStrategy';
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
   * Initializes an Express application to use passport and express-session
   * Note: If the session options is not defined, session will not be used.
   *
   * @param app - An express application
   * @param sessionOpts - Session options to be used by express-session
   * @param secret - secret used for Passport's JWT strategy
   */
  public init(app: express.Router, sessionOpts?: SessionOptions, secret?: string) {
    getLogger().info('Initializing express app to use express session and passport');
    if (sessionOpts) {
      app.use(session(sessionOpts));
      app.use(this.passport.initialize());
      app.use(this.passport.session());
    } else {
      if (secret) {
        this.jwtOpts = {
          jwtFromRequest: ExtractJwt.fromAuthHeader(),
          secretOrKey: secret
        };
      }
      app.use(this.passport.initialize());
    }

    this.setup(this.passport, this.jwtOpts);
  }

  /**
   * Function which checks if the user requesting access to the resource is authenticated and authorized to
   * access the resource. Redirects to the login page if user is not authenticated or returns a status of 403
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
   * Initialized passport configuration.
   * Method can be overridden to provide custom passport setup
   *
   * @param passportApi - passport.js instance
   */
  protected setup(passportApi: passport.Passport, jwtOpts?: JwtOptions) {
    if (jwtOpts) {
      passportApi.use(new JwtStrategy(jwtOpts, (jwtPayload, done) => {
        const callback = (err?: Error, user?: any) => {
          if (err) {
            return done(err, false);
          } else if (user) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        };
        this.userRepo.getUserByLogin(jwtPayload.username, callback);
      }));
    } else {
      passportApi.use(new Strategy(defaultStrategy(this.userRepo, this.userService)));
    }

    passportApi.serializeUser(defaultSerializeUser);
    passportApi.deserializeUser(defaultDeserializeUser);
  }
}

export default PassportAuth;
