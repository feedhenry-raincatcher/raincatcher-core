/**
 * User repository interface for retrieving user related data.
 * Implementations can retrieve users from different databases etc.
 */
export interface UserRepository {
  /**
   * Retrieves a user object from a data source by login id (i.e. username, email)
   *
   * @param loginId - A unique login id used to identify the user
   * @returns {Promise<any>} - Returns the user data if user was found
   */
  getUserByLogin(loginId: string, callback: (err?: Error, user?: any) => any): any;
}

export default UserRepository;
