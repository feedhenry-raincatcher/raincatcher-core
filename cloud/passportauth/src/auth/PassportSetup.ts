import * as express from 'express';
import * as session from 'express-session';
import * as passport from 'passport';
import {Strategy} from 'passport-local';
import {BaseUser} from '../user/BaseUser';
import {UserSecService} from '../user/UserSec';

export interface Setup {
  init(app: express.Express): void;
  setStrategy(): void;
  setSerializeUser(): void;
  setDeserializeUser(): void;
}

export class PassportSetup<T extends BaseUser> {
  protected userSec: UserSecService<T>;

  constructor(protected readonly userSecService: UserSecService<T>) {
    this.userSec = userSecService;
  }

  public init(app: express.Express) {
    console.log('initializing passport');
    app.use(session({secret: 'test', resave: false, saveUninitialized: false}));
    app.use(passport.initialize());
    app.use(passport.session());

    this.setStrategy();
    this.setSerializeUser();
    this.setDeserializeUser();
  }

  public setStrategy() {
    console.log('initializing strategy');
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

  public setSerializeUser() {
    console.log('initializing user serialize function');
    passport.serializeUser((user: T, done) => {
      return done(null, user);
    });
  }

  public setDeserializeUser() {
    console.log('initializing user deserialize function');
    passport.deserializeUser((id: string, done) => {
      return done(null, id);
    });
  }
}
