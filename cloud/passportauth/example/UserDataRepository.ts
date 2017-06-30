import * as Promise from 'bluebird';
import * as _ from 'lodash';
import {UserDataRepo} from '../src/index';
import BaseUser from './BaseUser';
import {UserData} from './UserSeedData';

/**
 * A sample implementation of a user data repository
 */
export class UserDataRepository implements UserDataRepo {
  constructor(protected readonly userData: UserData[]) {
  }

  /**
   * A sample get user using a login id from a data source
   *
   * @param loginId {string} - A unique login id used to identify the user (i.e. username)
   * @returns {Promise} - Returns a user object if user was found
   */
  public getUserByLogin(loginId: string) {
    const userObj = _.find(this.userData, function(user: UserData) {
      if (user.username === loginId) {
        return user;
      }
    });

    return Promise.resolve(new BaseUser(userObj));
  }
}

export default UserDataRepository;
