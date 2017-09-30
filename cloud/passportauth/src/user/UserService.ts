
/**
 * User service interface that defines a set of requirements (methods) for mapping particular fields from the
 * user object returned from the repository.
 *
 * @see UserRepository
 */
export interface UserService {
  /**
   * Checks if the password given by the user upon login matches
   * the password assigned to that user from the data source
   *
   * @param user - User data
   * @param password - Plain text password given by the user upon login
   * @returns {boolean} - Returns true/false if the password is valid
   */
  validatePassword(user: any, password: string): boolean;

  /**
   * Checks if the current user has the role required to access a resource
   *
   * @param user - User data
   * @param role - The role required to access a resource
   * @returns {boolean} - Returns true/false if the user is authorized to access a resource
   */
  hasResourceRole(user: any, role: string | undefined): boolean;

  /**
   * Returns profile data for the user
   * Function should be used to filter out data that should not be returned to the client.
   * For example password hash.
   */
  getProfile(user: any): any;
}

export default UserService;
