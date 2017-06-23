import BaseUser from './BaseUser';

export interface UserSec {
  getUserId(loginId: string): Promise<string>;
  comparePassword(id: string, password: string): Promise<boolean>;
  hasResourceRole(id: string, role: string): Promise<boolean>;
}

export class UserSecService implements UserSec {
  protected userApi: BaseUser;

  constructor(protected readonly UserApi: BaseUser) {
    this.userApi = UserApi;
  }

  /**
   * Retrieves the user's id using the user's login id.
   *
   * @param loginId {string} - A unique login id
   * @returns {Promise<string>} - Returns the user's id if found
   */
  public getUserId(loginId: string) {
    return this.userApi.getId(loginId);
  }

  /**
   * Compares the user's password with the user's password in the data source.
   *
   * @param id {string} - A unique id used to identify the user
   * @param password {string} - Password given by the user upon login
   * @returns {Promise<boolean>} - Returns true/false if the password given matches with the password
   * from the data source
   */
  public comparePassword(id: string, password: string) {
    return this.userApi.getPasswordHash(id).then((passwordHash: string) => {
      return (password === passwordHash); // TODO: replace with bcrypt [RAINCATCH-872]
    });
  }

  /**
   * Checks if the user has the role specified
   *
   * @param id {string} - A unique id used to identify the user
   * @param role {string} - Role to be checked if assigned to the given user
   * @returns {Promise<boolean>} - Returns true/false if the user has the role specified
   */
  public hasResourceRole(id: string, role: string) {
    return this.userApi.getRoles(id).then((roles: string[]) => {
      return (roles.indexOf(role) > -1);
    });
  }
}

export default UserSecService;
