import * as assert from 'assert';
import { DefaultDeserializeUser, DefaultSerializeUser } from '../src/auth/UserSerializer';

describe('Test Passport serializer', function() {
  it('should DefaultDeserializeUser', function(done) {
    const user = { test: 1 };
    DefaultDeserializeUser(user, function(err: any, result: any) {
      assert.equal(user, result);
      done();
    });
  });

  it('should DefaultSerializeUser', function() {
    const name = { test: 'test' };
    assert.ok(DefaultSerializeUser);
  });
});
