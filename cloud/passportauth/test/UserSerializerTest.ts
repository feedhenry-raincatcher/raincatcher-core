import * as assert from 'assert';
import { DefaultDeserializeUser, DefaultSerializeUser } from '../src/auth/UserSerializer';

describe('Test Passport serializer', function() {
  it('should DefaultDeserializeUser', function() {
    assert.ok(DefaultDeserializeUser());
  });

  it('should DefaultSerializeUser', function(done) {
    const name = 'test';
    DefaultSerializeUser(name, function(err, user) {
      assert.equal(user, name);
      done();
    });
  });
});
