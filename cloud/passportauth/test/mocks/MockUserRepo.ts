import * as Promise from 'bluebird';
import {User, UserRepository} from '../../src/index';

export const mockBaseUser: User = {
  getLoginId() {
    return 'testloginId';
  },
  getPasswordHash() {
    return 'testPasswordHash';
  },
  getRoles() {
    return ['testReqRole'];
  }
};

const MockUserRepo: UserRepository = {
  getUserByLogin(loginId: string) {
    if (loginId === 'testError') {
      return Promise.reject(new Error('[TEST] Error retrieving user'));
    }

    if (loginId === 'invalidUsername') {
      return Promise.resolve(undefined);
    }

    return Promise.resolve(mockBaseUser);
  }
};

export default MockUserRepo;
