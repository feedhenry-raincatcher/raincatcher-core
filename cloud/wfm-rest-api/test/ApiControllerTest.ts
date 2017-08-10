import * as assert from 'assert';
import * as express from 'express';
import * as proxyquire from 'proxyquire';
import { ApiController, ApiError, MongoDbRepository } from '../src/index';

describe('FeedHenry ApiController Tests', function() {
  describe('ApiController', function() {
    it('create router', function() {
      const router = express.Router();
      const repository = new MongoDbRepository('test');
      const testSubject = new ApiController(router, repository, 'testApi');
    });
  });
});
