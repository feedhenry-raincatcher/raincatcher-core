import * as express from 'express';
import * as session from 'express-session';
import * as passport from 'passport';
import {Strategy} from 'passport-local';
import BaseUser from '../user/BaseUser';
import UserSecService from '../user/UserSec';

export interface Setup {
  init(app: express.Express): void;
  setStrategy(): void;
  setSerializeUser(): void;
  setDeserializeUser(): void;
}

class PassportSetup<T extends BaseUser> {
  protected userSec: UserSecService<T>;

  constructor(protected readonly userSecService: UserSecService<T>) {
    this.userSec = userSecService;
  }

  public init(app: express.Express) {
    app.use(session({secret: 'test', resave: false, saveUninitialized: false}));
    app.use(passport.initialize());
    app.use(passport.session());

    this.setStrategy();
    this.setSerializeUser();
    this.setDeserializeUser();
  }

  public setStrategy() {
    passport.use(new Strategy((username, password, done) => {
      this.userSec.getLogin(username).then((user) => {
        if (!user) {
          return done(null, false);
        } else {
          this.userSec.comparePassword(username, password).then((valid) => {
            if (valid) {
              return done(null, username);
            } else {
              return done(null, false);
            }
          });
        }
      })
      .catch((err) => {
        return done(err);
      });
    }));
  }

  public setSerializeUser() {
    passport.serializeUser((user: T, done) => {
      return done(null, user);
    });
  }

  public setDeserializeUser() {
    // set deserialize function
    passport.deserializeUser((id: string, done) => {
      return done(null, id);
      // this.userSec.getProfileData(id).then((user) => {
      //   return done(null, user.id);
      // })
      // .catch((err) => {
      //   return done(err);
      // });
    });
  }
}

export default PassportSetup;
