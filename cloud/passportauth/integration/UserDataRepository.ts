import * as Promise from 'bluebird';
import * as _ from 'lodash';
import {User} from './UserSeedData';

export interface UserDataRepo {
  getUserById(id: string): Promise<User|undefined>;
}

/**
 * A sample implementation of a user data repository
 */
export class UserDataRepository implements UserDataRepo {
  protected userData: User[];

  constructor(protected readonly seedData: User[]) {
    this.userData = seedData;
  }

  /**
   * A sample get user using an id from a data source
   *
   * @param id {string} - A unique id used to identify the user
   * @returns {Promise} - Returns a user object if user was found
   */
  public getUserById(id: string) {
    const userObj = _.find(this.userData, function(user: User) {
      if (user.id === id || user.username === id) {
        return user;
      }
    });

    return Promise.resolve(userObj);
  }
}

export default UserDataRepository;
