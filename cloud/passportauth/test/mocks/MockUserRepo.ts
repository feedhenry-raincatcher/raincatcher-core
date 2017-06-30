import * as Promise from 'bluebird';
import {User, UserDataRepo} from '../../src/index';

const mockBaseUser: User = {
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

const MockUserRepo: UserDataRepo = {
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
