import * as express from 'express';
import * as session from 'express-session';
import {SessionOptions} from 'express-session';
import * as passport from 'passport';
import {Strategy} from 'passport-local';
import {UserSecService} from '../user/UserSec';

export interface Setup {
  init(app: express.Express, sessionOpts: SessionOptions): void;
  setStrategy(): void;
  setSerializeUser(): void;
  setDeserializeUser(): void;
}

export class PassportSetup implements Setup {
  protected userSec: UserSecService;

  constructor(protected readonly userSecService: UserSecService) {
    this.userSec = userSecService;
  }

  /**
   * Initializes passport authentication on an Express application.
   * This initializes the Express session, passport as well as
   * setting the local strategy, serializeUser and deserializeUser function.
   *
   * @param app {express.Express} An express app used by the application.
   * @param sessionOpts {SessionOptions} Configuration used by Express session
   */
  public init(app: express.Express, sessionOpts: SessionOptions) {
    app.use(session(sessionOpts));
    app.use(passport.initialize());
    app.use(passport.session());

    this.setStrategy();
    this.setSerializeUser();
    this.setDeserializeUser();
  }

  /**
   * Sets the local strategy used by passport authentication.
   */
  public setStrategy() {
    passport.use(new Strategy((loginId, password, done) => {
      this.userSec.getUserId(loginId).then((userId: string) => {
        if (!userId) {
          return done(null, false);
        } else {
          this.userSec.comparePassword(password).then((valid: boolean) => {
            return valid ? done(null, userId) : done(null, false);
          });
        }
      })
      .catch((err: Error) => {
        console.log('An error occurred: ', err);
        return done(err);
      });
    }));
  }

  /**
   * Sets the serializeUser function to be used by passport.
   */
  public setSerializeUser() {
    passport.serializeUser((userId: string, done) => {
      return done(null, userId);
    });
  }

  /**
   * Sets the deserializeUser function to be used by passport.
   */
  public setDeserializeUser() {
    passport.deserializeUser((userId: string, done) => {
      return done(null, userId);
    });
  }
}

export default PassportSetup;
