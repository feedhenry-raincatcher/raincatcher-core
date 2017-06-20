/// <reference types="mocha" />
import sync from '../src/index';

describe('Client Tests', function() {
  describe('#test api', function() {
    it('api should be available', function() {
      if (!sync.doList) {
        throw new Error('Api not mounted');
      }
    });
  });
});
