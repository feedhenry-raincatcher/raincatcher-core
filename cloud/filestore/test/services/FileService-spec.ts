import * as Promise from 'bluebird';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as del from 'del';
import * as fs from 'fs';
import { memoryStorage } from 'multer';
import { Stream } from 'stream';
import { FileMetadata } from '../../src/file-api/FileMetadata';
import * as fileService from '../../src/services/FileService';

import strToStream = require('string-to-stream');

chai.use(chaiAsPromised);

const existsAsync = (path) =>
  // can't use promisify because this doesn't return an error
  new Promise(resolve => fs.exists(path, exists => resolve(exists)));
const readFileAsync = Promise.promisify<string, string, string>(fs.readFile);

const { expect } = chai;

describe('FileService', function() {
  describe('createTemporaryStorageFolder', function() {
    const deleteDir = () => del(fileService.FILE_STORAGE_DIRECTORY, { force: true });
    beforeEach(() => deleteDir());

    it('should create a default directory', function() {
      const recreate = deleteDir()
        .then(() => fileService.createTemporaryStorageFolder())
        .then(() => existsAsync(fileService.FILE_STORAGE_DIRECTORY));
      // tslint:disable-next-line:no-unused-expression
      expect(recreate).to.eventually.be.true;
    });
    it('should be idempotent', function() {
      const createTwice = fileService.createTemporaryStorageFolder()
        .then(() => fileService.createTemporaryStorageFolder())
        .then(() => existsAsync(fileService.FILE_STORAGE_DIRECTORY));
      // tslint:disable-next-line:no-unused-expression
      expect(createTwice).to.eventually.be.true;
    });

    after(() => deleteDir());
  });
  describe('writeStreamToFile', function() {
    const metadata: FileMetadata = {
      id: 'some-uuid'
    };
    const testContent = 'test';
    const contentStream = strToStream(testContent);
    const filePath = fileService.buildFilePath(metadata.id);

    it('should write data to the file identified by id', function() {
      const writeAndRead = fileService.createTemporaryStorageFolder()
        .then(() => fileService.writeStreamToFile(metadata, contentStream))
        .then(() => readFileAsync(filePath, 'utf-8'));
      expect(writeAndRead).to.eventually.equal(testContent);
    });

    after(function() {
      // reset written file
      return del(filePath, { force: true });
    });
  });
  describe('buildFilePath', function() {
    it('should return a relative path to the root directory', function() {
      const value = fileService.buildFilePath('fake-file-id');
      expect(value).to.contain(fileService.FILE_STORAGE_DIRECTORY);
    });
  });
  describe('multerMiddleware', function() {
    it('should return a middleware', function() {
      const middleware = fileService.multerMiddleware().any();
      expect(middleware).to.be.a('function');
    });
    it('should accept other storage implementations', function() {
      const middleware = fileService.multerMiddleware(memoryStorage()).any();
      expect(middleware).to.be.a('function');
    });
  });
});
