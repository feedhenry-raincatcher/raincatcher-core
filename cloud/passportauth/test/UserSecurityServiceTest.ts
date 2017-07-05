import * as assert from 'assert';
import {  UserSecurityService } from '../src/user/UserSecurityService';
import MockUserRepo, { mockBaseUser } from './mocks/MockUserRepo';

describe('Test Passport UserSecurityService', function() {
  it('should match password', function() {
    const service = new UserSecurityService(MockUserRepo);
    assert.ok(service.comparePassword(mockBaseUser, mockBaseUser.getPasswordHash()));
  });

  it('should fetch user', function(done) {
    const service = new UserSecurityService(MockUserRepo);
    service.getUserByLogin(mockBaseUser.getLoginId()).then(function(newUser){
       assert.equal(newUser, mockBaseUser);
       done();
    });
  });
});
