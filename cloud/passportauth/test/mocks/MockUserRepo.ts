import { UserRepository, UserService } from '../../src/index';

export const mockUserService: UserService = {
  validatePassword(user: any, password: string) {
    return user.password === password;
  },
  hasResourceRole(user: any, roleRequired: string) {
    if (user.roles) {
      return user.roles.indexOf(roleRequired) > -1;
    } else {
      return false;
    }
  }
};

export const mockUserObj = {
  id: 'testId',
  username: 'testloginId',
  password: 'testPassword',
  roles: ['testRole']
};

export const MockUserRepo: UserRepository = {
  getUserByLogin(loginId: string, callback: (err?: Error, user?: any) => any) {
    if (loginId === 'testError') {
      return callback(new Error('[TEST] Error retrieving user'));
    }

    if (loginId === 'invalidUsername') {
      return callback(undefined, undefined);
    }

    return callback(undefined, mockUserObj);
  }
};

export default MockUserRepo;
