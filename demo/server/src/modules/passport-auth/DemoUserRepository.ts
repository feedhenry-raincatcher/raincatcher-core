
import { User, UserRepository } from '@raincatcher/auth-passport';
import * as Promise from 'bluebird';
import * as _ from 'lodash';

// tslint:disable-next-line:no-var-requires
const users: any = require('./users.json');

/**
 * A sample user implementation
 */
export class BaseUser implements User {
  // Wrap user object
  constructor(readonly user: any) {
  }

  public getLoginId() {
    return this.user ? this.user.username : undefined;
  }

  public getPasswordHash() {
    return this.user ? this.user.password : undefined;
  }

  public getRoles() {
    return this.user ? this.user.roles : [];
  }
}

/**
 * A sample implementation of a user data repository
 */
export class SampleUserRepository implements UserRepository {

  /**
   * A sample get user using a login id from a data source
   *
   * @param loginId {string} - A unique login id used to identify the user (i.e. username)
   * @returns {Promise} - Returns a user object if user was found
   */
  public getUserByLogin(loginId: string) {
    const userObj = _.find(users, function(user: any) {
      if (user.username === loginId) {
        return user;
      }
    });
    return Promise.resolve(new BaseUser(userObj));
  }
}

export default SampleUserRepository;
