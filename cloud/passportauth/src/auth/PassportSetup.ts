import * as express from 'express';
import * as session from 'express-session';
import {SessionOptions} from 'express-session';
import * as passport from 'passport';
import {Strategy} from 'passport-local';
import {BaseUser} from '../user/BaseUser';
import {UserSecService} from '../user/UserSec';

export interface Setup {
  init(app: express.Express, sessionOpts: SessionOptions): void;
  setStrategy(): void;
  setSerializeUser(): void;
  setDeserializeUser(): void;
}

export class PassportSetup<T extends BaseUser> implements Setup {
  protected userSec: UserSecService<T>;

  constructor(protected readonly userSecService: UserSecService<T>) {
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
    passport.use(new Strategy((username, password, done) => {
      this.userSec.getUserId(username).then((userId: string) => {
        if (!userId) {
          return done(null, false);
        } else {
          this.userSec.comparePassword(username, password).then((valid) => {
            if (valid) {
              return done(null, userId);
            } else {
              return done(null, false);
            }
          });
        }
      })
      .catch((err: Error) => {
        return done(err);
      });
    }));
  }

  /**
   * Sets the serializeUser function to be used by passport.
   */
  public setSerializeUser() {
    passport.serializeUser((user: string, done) => {
      return done(null, user);
    });
  }

  /**
   * Sets the deserializeUser function to be used by passport.
   */
  public setDeserializeUser() {
    passport.deserializeUser((id: string, done) => {
      return done(null, id);
    });
  }
}
