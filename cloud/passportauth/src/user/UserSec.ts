import {BaseUser} from './BaseUser';
import {UserApiService} from './UserApi';

export interface UserSec<T extends BaseUser> {
  getUserId(username: string): Promise<string>;
  comparePassword(id: string, password: string): Promise<boolean>;
  getUserRoles(id: string): Promise<string[]>;
}

export class UserSecService<T extends BaseUser> implements UserSec<T> {
  protected userApi: UserApiService<T>;

  constructor(protected readonly userApiService: UserApiService<T>) {
    this.userApi = userApiService;
  }

  /**
   * Retrieves user ID by username
   *
   * @param username {string} Username assigned to a user
   * @returns {Promise<string|null>} Returns the user's id if found, otherwise it returns null
   */
  public getUserId(username: string) {
    return this.userApi.findUserById(username).then((user) => {
      let id = null;
      if (user) {
        id = user.id;
      }
      return id;
    });
  }

  /**
   * Compares the password provided by the user with the password from the data source
   *
   * @param id {string} User ID
   * @param password {string} Password provided by the user
   * @returns {Promise<boolean>} Returns true if the passwords are the same, otherwise it returns false
   */
  public comparePassword(id: string, password: string) {
    return this.userApi.findUserById(id).then((user) => {
      return (user.password === password); // TODO: replace with bcrypt compare
    });
  }

  /**
   * Retrieves the roles assigned to a user
   * @param id {string} User ID
   * @returns {Promise<string[]>} Returns an array of roles assigned to the user. If no roles are assigned, it
   * returns an empty array
   */
  public getUserRoles(id: string) {
    return this.userApi.findUserById(id).then((user) => {
      return user.roles || [];
    });
  }
}
