import * as _ from 'lodash';
import { UserRepository } from '../src/index';
import { UserService } from '../src/index';

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
export class SampleUserService implements UserService {
  public getProfile(user: any) {
    return user;
  }
  public validatePassword(user: any, password: string) {
    return user.password === password;
  }

  public hasResourceRole(user: any, role: string|undefined) {
    if (role) {
      return user.roles.indexOf(role) > -1;
    } else {
      return true;
    }
  }
}

/**
 * A sample implementation of a user data repository
 */
export class SampleUserRepository implements UserRepository {
  /**
   * A sample get user using a login id from a data source
   */
  public getUserByLogin(loginId: string, callback: (err?: Error, user?: any) => any) {
    const userFound = _.find(userSeedData, function(user: any) {
      if (user.username === loginId) {
        return user;
      }
    });

    callback(undefined, userFound);
  }
}

export default SampleUserRepository;
