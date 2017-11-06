import * as Promise from 'bluebird';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as del from 'del';
import * as fs from 'fs';
import * as fileService from '../../src/services/FileService';

chai.use(chaiAsPromised);

const existsAsync = (path) =>
  new Promise(resolve => fs.exists(path, exists => resolve(exists)));

const { expect } = chai;

describe('FileService', function() {
  describe('createTemporaryStorageFolder', function() {
    it('should create a default directory', function() {
      const recreate = del(fileService.FILE_STORAGE_DIRECTORY, {
        force: true
      })
        .then(() => fileService.createTemporaryStorageFolder())
        .then(() => existsAsync(fileService.FILE_STORAGE_DIRECTORY));
      return expect(recreate).to.eventually.be.true;
    });
    it('should be idempotent', function() {
      const createTwice = fileService.createTemporaryStorageFolder()
        .then(() => fileService.createTemporaryStorageFolder())
        .then(() => existsAsync(fileService.FILE_STORAGE_DIRECTORY));
      return expect(createTwice).to.eventually.be.true;
    });
  });
  describe('writeStreamToFile', function() {
    it('should write data to the file identified by id');
  });
  describe('buildFilePath', function() {
    it('should return a relative path to the root directory', function() {
      const value = fileService.buildFilePath('test/directory/');
      expect(value).to.contain(fileService.FILE_STORAGE_DIRECTORY);
    });
  });
  describe('multerMiddleware', function() {
    it('should return a disk-backed middleware by default');
    it('should accept other storage implementations');
  });
});
