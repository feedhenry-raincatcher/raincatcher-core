import * as Bluebird from 'bluebird';
import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as proxyquire from 'proxyquire';
import { MongoDbRepository } from '../src/index';

interface TestEntity {
  id: string;
  name: string;
}
const testObj = { id: '1', name: 'test' };

const testSubject = new MongoDbRepository<TestEntity>('testCollection');
const testSubjectNoDb = new MongoDbRepository<TestEntity>('testCollection');
const mockDataAccessFunction = function() { return Bluebird.resolve(testObj); };
const mockCursor: any = {
  count() {
    return Bluebird.resolve(10);
  },
  sort() {
    return this;
  },
  skip() {
    return this;
  },
  limit() {
    return this;
  },
  toArray() {
    return [testObj];
  }
};
const db: any = {
  collection: () => ({
    findOne: mockDataAccessFunction,
    insertOne: mockDataAccessFunction,
    find() {
      return mockCursor;
    },
    updateOne: mockDataAccessFunction,
    deleteOne() {
      return {
        result: {
          ok: 1
        }
      };
    }
  })
};
testSubject.setDb(db);

describe('FeedHenry MongoDbRepository Tests', function() {
  describe('Test CRUD operations', function() {

    it('should create obj', function() {
      return Bluebird.all([
        expect(testSubject.create(testObj)).to.eventually.equal(testObj),
        expect(testSubjectNoDb.create(testObj)).to.be.rejected
      ]);
    });

    it('should get obj', function() {
      return Bluebird.all([
        expect(testSubject.get('1')).to.eventually.equal(testObj),
        expect(testSubjectNoDb.get('1')).to.be.rejected
      ]);
    });
    it('should list obj', function() {
      const page = { order: -1, page: 0, size: 10, sortField: 'id' };
      return Bluebird.all([
        expect(testSubject.list({}, page)).to.be.fulfilled,
        expect(testSubjectNoDb.list({}, page)).to.be.rejected
      ]);
    });
    it('should update obj', function() {
      return Bluebird.all([
        expect(testSubject.update(testObj)).to.be.fulfilled,
        expect(testSubjectNoDb.update(testObj)).to.be.rejected
      ]);
    });
    it('should delete obj', function() {
      return Bluebird.all([
        expect(testSubject.delete('id')).to.be.fulfilled,
        expect(testSubjectNoDb.delete('id')).to.be.rejected
      ]);
    });
  });
});
