import { getLogger } from '@raincatcher/logger';
import * as express from 'express';
import * as session from 'express-session';
import { SessionOptions } from 'express-session';
import * as jwt from 'jsonwebtoken';
import * as passport from 'passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
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
  public init(app: express.Router, sessionOpts?: SessionOptions) {
    getLogger().info('Initializing express app to use express session and passport');
    if (sessionOpts) {
      app.use(session(sessionOpts));
      app.use(this.passport.initialize());
      app.use(this.passport.session());
    } else {
      app.use(this.passport.initialize());
    }
    this.setup(this.passport);
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
      let user;
      if (req.headers && req.headers.authorization) {
        let token = req.headers.authorization.toString();
        token = token.substring(4); // Need to remove JWT at the beginning
        try {
          user = jwt.verify(token, 'secret'); // verifies the token and decodes the payload
        } catch (error) {
          return res.status(401).json(new Error(error));
        }
      } else if (!req.isAuthenticated()) {
        if (req.session) {
          // Used for redirecting to after a successful login when option successReturnToOrRedirect is defined.
          req.session.returnTo = self.setReturnToUrl(req);
          req.session.clientURL = req.session.returnTo;
        }
        return res.status(401).send();
      }

      if (req.user) {
        user = req.user;
      }

      const hasRole = role ? this.userService.hasResourceRole(user, role) : true;
      return hasRole ? next() : self.accessDenied(req, res);
    };
  }

  /**
   * Creates a middleware for authentication purposes.
   * This method wraps `passport.authenticate` to provide a middleware for authenticating users.
   * It also includes a check if the user is already authenticated. If the user is already
   * authenticated, it redirects back to the application, otherwise, it proceeds to authenticate
   * the user.
   *
   * @param defaultRedirect - location to redirect after successful authentication
   *                          when login page was loaded directly (without redirect)
   * @param errorRedirect - location to redirect after unsuccessful authentication
   */
  public authenticate(strategy: string, defaultRedirect?: string, errorRedirect?: string) {
    const self = this;
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
      if (req.isAuthenticated() && req.session) {
        if (req.session.clientURL) {
          return res.redirect(req.session.clientURL);
        }
        return next();
      } else {
        if (defaultRedirect && errorRedirect) {
          return this.passport.authenticate(strategy, {
            failureRedirect: errorRedirect,
            successReturnToOrRedirect: defaultRedirect
          })(req, res, next);
        }
        return this.passport.authenticate(strategy)(req, res, next);
      }
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
  protected setup(passportApi: passport.Passport) {
    const options = {
      jwtFromRequest: ExtractJwt.fromAuthHeader(),
      secretOrKey: 'secret'
    };
    passportApi.use(new Strategy(defaultStrategy(this.userRepo, this.userService)));
    passportApi.use(new JwtStrategy(options, (jwtPayload, done) => {
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
    passportApi.serializeUser(defaultSerializeUser);
    passportApi.deserializeUser(defaultDeserializeUser);
  }
}

export default PassportAuth;
