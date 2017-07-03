import * as Promise from 'bluebird';
import User from './User';

/**
 * Interface for retrieving user related data.
 * Implementations can retrieve users from different databases etc.
 */
export interface UserRepository {
  /**
   * Retrieves a user object from a data source by login id (i.e. username, email)
   *
   * @param loginId {string} - A unique login id used to identify the user
   * @returns {Promise<User>}
   */
  getUserByLogin(loginId: string): Promise<User>;
}

export default UserRepository;
