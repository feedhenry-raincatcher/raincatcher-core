import { User, UsersRepository } from '@raincatcher/wfm-user';
import * as Bluebird from 'bluebird';
import * as _ from 'lodash';

// tslint:disable-next-line:no-var-requires
export const users: User[] = require('./users.json');

/**
 * Implementation for UsersRepository based on static demo data.
 * Note: This implementation is only for demo purposes.
 */
export class StaticUsersRepository implements UsersRepository {
  public getUser(id: string | number): Bluebird<User> {
    const foundUser = _.find(users, function(user: User) {
      return user.id === id;
    });
    if (!foundUser) {
      return Bluebird.reject(`User with id ${id} not found`);
    }
    return Bluebird.resolve(foundUser);
  }
  public retrieveUsers(filter: string, limit: number): Bluebird<User[]> {
    let filteredList: User[];
    if (!filter) {
      filteredList = [];
    } else {
      filteredList = _.filter(users, function(user: User) {
        return user.name.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
      });
    }
    return Bluebird.resolve(_.take(filteredList, limit));
  }
}
