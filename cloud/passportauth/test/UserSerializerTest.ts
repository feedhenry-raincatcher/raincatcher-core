import * as assert from 'assert';
import { defaultDeserializeUser, defaultSerializeUser } from '../src/auth/UserSerializer';

describe('Test Passport serializer', function() {
  it('should DefaultDeserializeUser', function(done) {
    const user = { test: 1 };
    defaultDeserializeUser(user, function(err: any, result: any) {
      assert.equal(user, result);
      done();
    });
  });

  it('should DefaultSerializeUser', function() {
    const name = { test: 'test' };
    assert.ok(defaultSerializeUser);
  });
});
