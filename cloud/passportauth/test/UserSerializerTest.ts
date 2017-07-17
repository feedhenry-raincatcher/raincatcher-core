import * as assert from 'assert';
import { defaultDeserializeUser, defaultSerializeUser } from '../src/auth/UserSerializer';

describe('Test Passport serializer', function() {
  const user = {test: 'test'};

  it('should DefaultDeserializeUser', function(done) {
    defaultDeserializeUser(user, function(err: any, result: any) {
      assert.equal(user, result);
      done();
    });
  });

  it('should DefaultSerializeUser', function(done) {
    defaultSerializeUser(user, function(err: any, result: any) {
      assert.equal(user, result);
      done();
    });
  });
});
