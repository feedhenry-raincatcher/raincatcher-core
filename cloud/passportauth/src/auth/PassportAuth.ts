import * as express from 'express';
import * as passport from 'passport';
import {BaseUser} from '../user/BaseUser';
import {UserSecService} from '../user/UserSec';

interface Auth {
  login(strategy: string, opts?: object): void;
  protect(role: string, loginRoute: string): void;
  isAuthenticated(req: express.Request): boolean;
  getUserProfile(userId: string): void;
  logout(req: express.Request): void;
}

export class PassportAuth<T extends BaseUser> implements Auth {
  protected userSec: UserSecService<T>;

  constructor(protected readonly UserSec: UserSecService<T>) {
    this.userSec = UserSec;
  }

  public login(strategy: string, opts?: object) {
    if (!opts) {
      opts = {};
    }
    return passport.authenticate(strategy, opts);
  }

  public protect(role: string, loginRoute: string) {
    return function(req: express.Request, res: express.Response, next: () => void) {
      if (req.isAuthenticated()) {
        // add check for role here.
        return next();
      } else {
        res.redirect(loginRoute);
      }
    };
  }

  public isAuthenticated(req: express.Request) {
    return req.isAuthenticated();
  }

  public getUserProfile(userId: string) {
    return this.userSec.getProfileData(userId);
  }

  public logout(req: express.Request) {
    req.logout();
    // add a redirect here to homepage/logoutRoute/etc.?
  }
}
