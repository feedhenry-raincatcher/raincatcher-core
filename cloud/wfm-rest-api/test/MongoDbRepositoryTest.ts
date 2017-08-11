import * as assert from 'assert';
import * as proxyquire from 'proxyquire';
import { MongoDbRepository } from '../src/index';

const testObj = { id: 1, name: 'test' };

const testSubject = new MongoDbRepository('testCollection');
const testSubjectNoDb = new MongoDbRepository('testCollection');
const mock = function() { return db; };
const db: any = {
  collection: mock,
  findOne: mock,
  insertOne: mock,
  find() {
    return {
      count(filter, cb) {
        cb(10);
      }
    };
  },
  updateOne: mock,
  deleteOne: mock
};
testSubject.setDb(db);

describe('FeedHenry MongoDbRepository Tests', function() {
  describe('Test CRUD operations', function() {
    it('should create obj', function() {
      assert.ok(testSubjectNoDb.create(testObj));
      assert.ok(testSubject.create(testObj));
    });
    it('should get obj', function() {
      assert.ok(testSubjectNoDb.get('test'));
      assert.ok(testSubject.get('test'));
    });
    it('should list obj', function() {
      const page = { order: -1, page: 0, size: 10, sortField: 'id' };
      assert.ok(testSubject.list({}, page));
      assert.ok(testSubjectNoDb.list({}, page));
    });
    it('should update obj', function() {
      assert.ok(testSubject.update(testObj));
      assert.ok(testSubjectNoDb.update(testObj));
    });
    it('should delete obj', function() {
      assert.ok(testSubject.delete('id'));
      assert.ok(testSubjectNoDb.delete('id'));
    });
  });
});
