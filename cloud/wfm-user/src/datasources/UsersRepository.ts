/**
 * @module @raincatcher/wfm-user
 */

import * as Bluebird from 'bluebird';
import { User } from './User';

/**
 * Interface used to retrieve list of users for purpose of the WFM framework.
 * This users can be assigned to workorders etc.
 */
export interface UsersRepository {

  /**
   * Retrieve users from datasource
   *
   * @param filter - defines user specified way to filter users (it may be email/name.id)
   * @param limit - used to limit number of results for situations when list of users will be to large.
   */
  retrieveUsers(filter: string, limit: number): Bluebird<User[]>;

  /**
   * Retrieve single user from datasource
   *
   * @param id - user identifier
   */
  getUser(id: string | number): Bluebird<User>;
}
