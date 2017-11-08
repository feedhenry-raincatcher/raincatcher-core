import * as Promise from 'bluebird';
import { expect } from 'chai';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { readFileSync } from 'fs';
import * as mongo from 'mongodb';
import { MongoClient } from 'mongodb';
import * as path from 'path';
import { FileMetadata } from '../../src/file-api/FileMetadata';
import { GridFsStorage } from '../../src/impl/GridFsStorage';

const connectAsync = Promise.promisify<mongo.Db, string>(MongoClient.connect);

chai.use(chaiAsPromised);

function readStream(stream: NodeJS.ReadableStream): Promise<string> {
  let data = '';
  stream.setEncoding('utf8');
  stream.on('data', chunk => data += chunk);
  return new Promise(resolve => stream.on('end', () => resolve(data)));
}

describe('GridFsStorage', function() {
  const mongoUrl = 'mongodb://127.0.0.1:27017/testdb';
  const dbFactory = () => connectAsync(mongoUrl);
  let db: mongo.Db;
  const metadata: FileMetadata = {
    id: 'test-file'
  };
  const fileLocation = path.resolve(__dirname, '../fixtures/test.txt');
  const fileContents = readFileSync(fileLocation, {
    encoding: 'utf8'
  });

  before(function() {
    return dbFactory().then(database => db = database);
  });
  after(function() {
    db.close();
  });

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

  it('should write and read back a file from storage', function() {
    const storage = new GridFsStorage(db);
    const write = storage.writeFile(metadata, fileLocation);
    const read = write
      .then(() => storage.readFile(metadata.id))
      .then(readStream);
    return expect(write).to.eventually.be.fulfilled &&
      expect(read).to.eventually.equal(fileContents);
  });
});
