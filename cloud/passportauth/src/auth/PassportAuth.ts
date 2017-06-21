import * as express from 'express';
import {BaseUser} from '../user/BaseUser';
import {UserSecService} from '../user/UserSec';

export interface Auth {
  protect(role?: string): void;
}

export class PassportAuth<T extends BaseUser> implements Auth {
  protected userSec: UserSecService<T>;
  protected loginRoute: string;
  protected strategy: string;

  constructor(protected readonly UserSecService: UserSecService<T>, loginRoute?: string) {
    this.userSec = UserSecService;
    this.loginRoute = loginRoute || '/login';
    this.strategy = 'local';
  }

  /**
   * Function which checks if the user requesting access to the route is authenticated and authorized to
   * access the route. Redirects to the login page if user is not authenticated or returns an 'Unauthorized'
   * response if user does not have the required role.
   *
   * @param role {string} [Optional] Role which the user needs in order to access this resource
   */
  public protect(role?: string) {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
      if (req.isAuthenticated()) {
        if (!role) {
          return next();
        } else {
          this.userSec.getUserRoles(req.user).then((roles: string[]) => {
            if (roles.indexOf(role) > -1) {
              return next();
            } else {
              return res.status(401).send('Unauthorized');
            }
          });
        }
      } else {
        if (req.session) {
          // Used for redirecting to after successful login when option successReturnToOrRedirect is defined.
          req.session.returnTo = req.url;
        }
        res.redirect(this.loginRoute);
      }
    };
  }
}
