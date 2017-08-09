import * as Promise from 'bluebird';
import { UserService } from '../../src/index';

class MockUserService implements UserService {
  public readUser() {
    return Promise.resolve({
      id: 'trever'
    });
  }
}

const mockUserService = new MockUserService();
export { mockUserService };
