import { getLogger } from '@raincatcher/logger';
import * as Promise from 'bluebird';
import * as fs from 'fs';
import * as gridfs from 'gridfs-stream';
import * as mongo from 'mongodb';
import { MongoClient } from 'mongodb';
import { Stream } from 'stream';
import { FileMetadata } from '../file-api/FileMetadata';
import { FileStorage } from '../file-api/FileStorage';

const connectAsync = Promise.promisify<mongo.Db, string>(MongoClient.connect);

/**
 * Reference implementation for GridFsStorage.
 * See MongoDB documentation for more details.
 */
export class GridFsStorage implements FileStorage {

  public gridFileSystem: gridfs.Grid;
  private fileSystemPromise: Promise<gridfs.Grid>;

  /**
   * Creates instance of the GridFsStorage that will connect to specified mongo url
   * @param connection - MongoDB connection url or connection instance
   */
  constructor(connection: string | mongo.Db) {
    if (typeof connection === 'string') {
      this.fileSystemPromise = connectAsync(connection)
        .then(conn => this.gridFileSystem = gridfs(conn, mongo));
    } else {
      this.gridFileSystem = gridfs(connection, mongo);
      this.fileSystemPromise = Promise.resolve(this.gridFileSystem);
    }
  }

  /**
   * Gets the underlying gridfs filesystem instance
   * @return A promise of the underlying fileSystem
   */
  public getFileSystem() {
    return this.fileSystemPromise;
  }

  public writeFile(metadata: FileMetadata, fileLocation: string): Promise<string> {
    const self = this;
    if (!self.gridFileSystem) {
      return Promise.reject('Not initialized');
    }
    const options = {
      filename: metadata.id
    };
    return new Promise(function(resolve, reject) {
      const writeStream = self.gridFileSystem.createWriteStream(options);
      writeStream.on('error', function(err) {
        getLogger().error('An error occurred!', err);
        reject(err);
      });
      writeStream.on('close', function(file) {
        resolve(file.filename);
      });
      fs.createReadStream(fileLocation).pipe(writeStream);
    });
  }

  public readFile(id: string): Promise<Stream> {
    const self = this;
    if (!self.gridFileSystem) {
      return Promise.reject('Not initialized');
    }
    const options = {
      filename: id
    };
    return new Promise(function(resolve, reject) {
      const readstream = self.gridFileSystem.createReadStream(options);
      readstream.on('error', function(err) {
        getLogger().error('An error occurred when reading file from gridfs!', err);
        reject(err);
      });
      resolve(readstream);
    });
  }
}
