
/**
 * User interface that defines set of requirements (methods) for user objects returned from repository.
 * Interface is used to map particular fields.
 *
 * @see UserRepository
 */
export interface User {
  /**
   * Retrieves unique login id
   *
   * @returns {string|undefined} - A unique id used by the user for login (i.e. username, email)
   */
  getLoginId(): string|undefined;

  /**
   * Retrieves the user's hashed password.
   * This field will be used to verify user password
   *
   * @returns {string|undefined} - User's hashed password
   */
  getPasswordHash(): string|undefined;

  /**
   * Retrieves the user's roles
   *
   * @returns {string[]} - An array containing roles assigned to the user
   */
  getRoles(): string[];
}

export default User;
