import {BunyanLogger, Logger} from '@raincatcher/logger';
import * as express from 'express';
import * as session from 'express-session';
import {SessionOptions} from 'express-session';
import * as passport from 'passport';
import {Strategy} from 'passport-local';
import {DEFAULT_DESERIALIZE_USER, DEFAULT_SERIALIZE_USER, DEFAULT_STRATEGY} from '../constants';
import {UserSec} from '../user/UserSec';

export interface Auth {
  /**
   * Initializes an Express application to use passport and express-session
   *
   * @param app {express.Express} - An express application
   * @param sessionOpts {SessionOptions} - Session options to be used by express-session
   */
  init(app: express.Express, sessionOpts: SessionOptions): void;

  /**
   * Sets the strategy, serializeUser and deserializeUser functions that Passport will use
   *
   * @param strategy {Function} - Function to be used by passport's local strategy
   * @param serializeUser {Function} - Function to be used by passport's serializeUser
   * @param deserializeUser {Function} - Function to be used by passport's deserializeUser
   */
  setup(strategy ?: (userSec: UserSec) =>
        (loginId: string, password: string, cb: (error: Error|null, user: any) => any ) => any,
        serializeUser ?: (user: any, cb: (error: Error|null, user: any) => any) => any,
        deserializeUser ?: (userSec: UserSec) => (user: any, cb: (error: Error|null, user: any) => any) => any): void;

  /**
   * Sets the strategy to be used by Passport's local strategy
   *
   * @param strategy {Function} - Function to be used by passport's local strategy
   */
  setupStrategy(strategy: (userSec: UserSec) =>
      (loginId: string, password: string, cb: (error: Error|null, user: any) => any ) => any): void;

  /**
   * Sets the serializeUser function to be used by Passport
   *
   * @param serializeUser {Function} - Function to be used by passport's serializeUser
   */
  setupSerializeUser(serializeUser: (user: any, cb: (error: Error|null, user: any) => any) => any): void;

  /**
   * Sets the deserializeUser function to be used by Passport
   *
   * @param deserializeUser {Function} - Function to be used by passport's deserializeUser
   */
  setupDeserializeUser(deserializeUser: (userSec: UserSec) =>
    (user: any, cb: (error: Error|null, user: any) => any) => any): void;

  /**
   * Function which checks if the user requesting access to the resource is authenticated and authorized to
   * access the resource. Redirects to the login page if user is not authenticated or returns a status of 401
   * if the user does not have the required role.
   *
   * @param role {string} - Role which the user needs in order to access this resource
   */
  protect(role?: string): void;
}

export class PassportAuth implements Auth {
  protected loginRoute: string;
  private log: Logger = new BunyanLogger({name: 'Passport-Auth', level: 'error'});

  constructor(protected readonly userSec: UserSec, loginRoute?: string) {
    this.loginRoute = loginRoute || '/login';
  }

  public init(app: express.Express, sessionOpts: SessionOptions) {
    this.log.info('Initializing express app to use express session and passport');
    app.use(session(sessionOpts));
    app.use(passport.initialize());
    app.use(passport.session());
  }

  public setup(strategy ?: (userSec: UserSec) =>
               (loginId: string, password: string, cb: (error: Error|null, user: any) => any ) => any,
               serializeUser ?: (user: any, cb: (error: Error|null, user: any) => any) => any,
               deserializeUser ?: (userSec: UserSec) => (user: any, cb: (error: Error|null, user: any) => any) => any) {
    strategy ? this.setupStrategy(strategy) : this.setupStrategy(DEFAULT_STRATEGY);
    serializeUser ? this.setupSerializeUser(serializeUser) : this.setupSerializeUser(DEFAULT_SERIALIZE_USER);
    deserializeUser ? this.setupDeserializeUser(deserializeUser) : this.setupDeserializeUser(DEFAULT_DESERIALIZE_USER);
  }

  public setupStrategy(strategy: (userSec: UserSec) =>
      (loginId: string, password: string, cb: (error: Error|null, user: any) => any ) => any) {
    this.log.info('Setting up passport local strategy');
    passport.use(new Strategy(strategy(this.userSec)));
  }

  public setupSerializeUser(serializeUser: (user: any, cb: (error: Error|null, user: any) => any) => any) {
    this.log.info('Setting up passport serializeUser');
    passport.serializeUser(serializeUser);
  }

  public setupDeserializeUser(deserializeUser: (userSec: UserSec) =>
      (user: any, cb: (error: Error|null, user: any) => any) => any) {
    this.log.info('Setting up passport deserializeUser');
    passport.deserializeUser(deserializeUser(this.userSec));
  }

  public protect(role?: string) {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
      if (!req.isAuthenticated()) {
        if (req.session) {
          // Used for redirecting to after a successful login when option successReturnToOrRedirect is defined.
          req.session.returnTo = req.url;
        }
        return res.redirect(this.loginRoute);
      }

      return this.userSec.hasResourceRole(role) ? next() : res.status(401).send(new Error('Unauthorized'));
    };
  }
}

export default PassportAuth;
