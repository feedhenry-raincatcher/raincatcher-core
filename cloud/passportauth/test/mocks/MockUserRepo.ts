import * as Promise from 'bluebird';
import {User, UserRepository} from '../../src/index';

export const mockUserService: User = {
  getLoginId(user: any) {
    return user.id;
  },
  getPassword(user: any) {
    return user.password;
  },
  getRoles(user: any) {
    return user.roles;
  }
};

export const mockUserObj = {
  id: 'testId',
  username: 'testloginId',
  password: 'testPassword',
  roles: ['testRole']
};

export const MockUserRepo: UserRepository = {
  getUserByLogin(loginId: string) {
    if (loginId === 'testError') {
      return Promise.reject(new Error('[TEST] Error retrieving user'));
    }

    if (loginId === 'invalidUsername') {
      return Promise.resolve(undefined);
    }

    return Promise.resolve(mockUserObj);
  }
};

export default MockUserRepo;
