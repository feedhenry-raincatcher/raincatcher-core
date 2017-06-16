import * as express from 'express';
import * as passport from 'passport';
import BaseUser from '../user/BaseUser';
import UserSecService from '../user/UserSec';

interface Auth {
  protect(req: express.Request, res: express.Response, next: () => void): void; // protect/authenticate?
  login(opts?: object): void;
  logout(req: express.Request): void;
  isAuthenticated(req: express.Request, res: express.Response, next: () => void): void;
  getUserProfile(req: express.Request): void;
}

class PassportAuth<T extends BaseUser> implements Auth {
  protected strategy: string;
  protected loginRoute: string;
  protected userSec: UserSecService<T>;

  constructor(protected readonly Strategy: string, LoginRoute: string, UserSec: UserSecService<T>) {
    this.strategy = Strategy;
    this.loginRoute = LoginRoute;
    this.userSec = UserSec;
  }
  public protect(req: express.Request, res: express.Response, next: () => void) {
    if (this.isAuthenticated(req, res, next)) {
      // add check for role here.
      return next();
    } else {
      res.redirect(this.loginRoute);
    }
  }

  public login(opts?: object) {
    if (!opts) {
      opts = {};
    }

    passport.authenticate(this.strategy, opts);
  }

  public logout(req: express.Request) {
    return req.logout();
  }

  public isAuthenticated(req: express.Request, res: express.Response, next: () => void) {
    return req.isAuthenticated();
  }

  public getUserProfile(req: express.Request) {
    return this.userSec.getProfileData(req.user);
  }
}

export default PassportAuth;
