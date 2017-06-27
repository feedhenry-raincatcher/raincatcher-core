import * as Promise from 'bluebird';

const MockUserApi = {
  getId(loginId: string) {
    if (loginId === 'testError') {
      return Promise.reject('Test error');
    }
    if (loginId !== 'test') {
      return Promise.resolve(null);
    }
    return Promise.resolve('testId');
  },
  getLoginId() {
    return Promise.resolve('test');
  },
  getPasswordHash() {
    return Promise.resolve('testPassword');
  },
  getRoles() {
    return Promise.resolve(['testReqRole']);
  }
};

export default MockUserApi;
