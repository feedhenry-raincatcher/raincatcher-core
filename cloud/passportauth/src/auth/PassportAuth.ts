import * as express from 'express';
import UserSecService from '../user/UserSec';

export interface Auth {
  protect(role?: string): void;
}

export class PassportAuth implements Auth {
  protected userSec: UserSecService;
  protected loginRoute: string;
  protected strategy: string;

  constructor(protected readonly UserSecService: UserSecService, loginRoute?: string, strategy?: string) {
    this.userSec = UserSecService;
    this.loginRoute = loginRoute || '/login';
    this.strategy = strategy || 'local';
  }

  /**
   * Function which checks if the user requesting access to the resource is authenticated and authorized to
   * access the resource. Redirects to the login page if user is not authenticated or returns an 'Unauthorized'
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
          this.userSec.hasResourceRole(req.user, role).then((hasRole: boolean) => {
            return hasRole ? next() : res.status(401).send('Unauthorized');
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

export default PassportAuth;
