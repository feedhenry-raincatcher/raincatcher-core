export interface BaseUser {
  /**
   * Retrieve's the user's id.
   *
   * @param loginId {string} - User's login id (i.e. username, email, etc)
   * @returns {Promise<string>} - A unique id used to identify the user
   */
  getId(loginId: string): Promise<string|null>;

  /**
   * Retrieves the user's login id
   *
   * @returns {Promise<string>} - A unique id used by the user for login
   */
  getLoginId(): Promise<string|null>;

  /**
   * Retrieves the user's hashed password
   *
   * @returns {Promise<string>} - User's hashed password
   */
  getPasswordHash(): Promise<string|null>;

  /**
   * Retrieves the user's roles
   *
   * @returns {Promise<string[]>} - An array containing roles assigned to the user
   */
  getRoles(): Promise<string[]|null>;
}

export default BaseUser;
