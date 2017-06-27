import * as Promise from 'bluebird';

const MockUserApi = {
  getId(loginId: string) {
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
