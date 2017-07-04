import * as Promise from 'bluebird';
import User from './User';
import UserDataRepo from './UserRepository';

/**
 * Service for all user related security operations.
 * Can be overridden to provide custom implementations
 */
export class UserSecurityService {
  protected user: User;

  constructor(protected readonly userRepo: UserDataRepo) {
  }

  /**
   * Retrieves user by login.
   *
   * @param loginId {string} - A unique id used by a user for login (i.e. username, email)
   * @returns {Promise<User>}
   */
  public getUserByLogin(loginId: string) {
    return this.userRepo.getUserByLogin(loginId);
  }

  /**
   * Validates the user's password given on login against the user's
   * password from the data source
   *
   * @param user - user object
   * @param password {string} - Password given by the user upon login
   * @returns {boolean} - Returns true/false if the password given matches with the password
   * from the data source
   */
  public comparePassword(user: User, password: string) {
    const passwordHash = user.getPasswordHash();
    return (password === passwordHash); // TODO: replace with bcrypt [RAINCATCH-872]
  }

  /**
   * Checks if the user has the role specified
   *
   * @param user - user object
   * @param role {string} - Role to be checked if assigned to the given user
   * @returns {boolean} - Returns true/false if the user has the role specified
   */
  public hasResourceRole(user: User, role: string|undefined) {
    const userRoles = user.getRoles();
    return role ? (userRoles.indexOf(role) > -1) : true;
  }
}

export default UserSecurityService;
