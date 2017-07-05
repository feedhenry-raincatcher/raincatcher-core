import * as Promise from 'bluebird';
import * as _ from 'lodash';
import { UserRepository } from '../src/index';
import { User } from '../src/index';

/**
 * Fixed user data for demo purposes.
 */
const userSeedData = [
  {
    id: '001',
    username: 'test-admin',
    password: '123',
    roles: ['admin', 'user']
  },
  {
    id: '002',
    username: 'test-user',
    password: '123',
    roles: ['user']
  }
];

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
    const userObj = _.find(userSeedData, function(user) {
      if (user.username === loginId) {
        return user;
      }
    });
    return Promise.resolve(new BaseUser(userObj));
  }
}

export default SampleUserRepository;
