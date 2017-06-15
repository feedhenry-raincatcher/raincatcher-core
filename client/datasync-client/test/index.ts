/// <reference types="mocha" />
let api: any;

describe('Client Tests', function() {
  beforeEach(function() {
    api = { test: 5 };
  });
  describe('#test api', function() {
    it('api should be available', function() {
      api.test = 4;
    });
  });
});
