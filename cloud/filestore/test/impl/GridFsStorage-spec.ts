import { expect } from 'chai';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as mongo from 'mongodb';
import { GridFsStorage } from '../../src/impl/GridFsStorage';

chai.use(chaiAsPromised);

describe('GridFsStorage', function() {
  const db = new mongo.Db('testdb', new mongo.Server('127.0.0.1', 27017));
  const mongoUrl = 'mongodb://127.0.0.1:27017/testdb';
  describe('constructor', function() {
    it('should accept a mongodb connection', function() {
      const storage = new GridFsStorage(db);
      return expect(storage.gridFileSystem).to.exist &&
        expect(storage.getFileSystem()).to.eventually.be.fulfilled;
    });
    it('should accept a mongodb url', function() {
      const storage = new GridFsStorage(mongoUrl);
    });
  });
  describe('writeFile', function() {
    it('should write a file to the storage', function() {
      const storage = new GridFsStorage(db);
    });
  });
  describe('readFile', function() {
    it('should read back a file from the storage');
  });
});
