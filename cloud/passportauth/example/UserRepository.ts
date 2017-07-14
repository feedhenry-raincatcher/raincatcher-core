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
 * A sample user service implementation
 */
export class UserService implements User {
  // Map user object
  public getLoginId(user: any) {
    return user.username;
  }

  public getPassword(user: any) {
    return user.password;
  }

  public getRoles(user: any) {
    return user.roles;
  }
}

/**
 * A sample implementation of a user data repository
 */
export class SampleUserRepository implements UserRepository {
  /**
   * A sample get user using a login id from a data source
   *
   * @param loginId - A unique login id used to identify the user (i.e. username)
   * @returns {Promise} - Returns a user object if user was found
   */
  public getUserByLogin(loginId: string) {
    const userObj = _.find(userSeedData, function(user) {
      if (user.username === loginId) {
        return user;
      }
    });
    return Promise.resolve(userObj);
  }
}

export default SampleUserRepository;
