import { User, UsersRepository } from '@raincatcher/wfm-user';
import * as Bluebird from 'bluebird';
import * as _ from 'lodash';
import { users } from '../demo-data';

/**
 * Implementation for UsersRepository based on static demo data.
 *
 * Note: This implementation is only for demo purposes.
 */
export class StaticUsersRepository implements UsersRepository {
  public retrieveUsers(filter: string, limit: number): Bluebird<User[]> {
    let filteredList;
    if (!filter) {
      filteredList = [];
    } else {
      filteredList = _.filter(users, function(user: User) {
        if (user && user.name) {
          return user.name.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
        }
      });
    }
    return Bluebird.resolve(_.take(filteredList, limit));
  }
}
