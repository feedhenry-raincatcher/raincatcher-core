
/**
 * User service interface that defines a set of requirements (methods) for mapping particular fields from the
 * user object returned from the repository.
 *
 * @see UserRepository
 */
export interface UserService {
  /**
   * Retrieves unique login id
   *
   * @returns {string} - A unique id used by the user for login (i.e. username, email)
   */
  getLoginId(user: any): string;

  /**
   * Retrieves the user's password.
   * This field will be used to verify the user password
   *
   * @returns {string} - User's password
   */
  getPassword(user: any): string;

  /**
   * Retrieves the user's roles
   *
   * @returns {string[]} - An array containing roles assigned to the user
   */
  getRoles(user: any): string[];
}

export default UserService;
