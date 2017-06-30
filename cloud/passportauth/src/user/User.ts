export interface User {
  /**
   * Retrieves the user's login id
   *
   * @returns {string|undefined} - A unique id used by the user for login (i.e. username, email)
   */
  getLoginId(): string|undefined;

  /**
   * Retrieves the user's hashed password
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
