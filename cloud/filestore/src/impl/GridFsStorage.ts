import { getLogger } from '@raincatcher/logger';
import * as BlueBird from 'bluebird';
import * as fs from 'fs';
import * as gridfs from 'gridfs-stream';
import * as mongo from 'mongodb';
import { MongoClient } from 'mongodb';
import { Stream } from 'stream';
import { FileMetadata } from '../file-api/FileMetadata';
import { FileStorage } from '../file-api/FileStorage';

/**
 * Reference implementation for GridFsStorage.
 * See MongoDB documentation for more details.
 */
export class GridFsStorage implements FileStorage {

  private gridFileSystem: gridfs.Grid;

  /**
   * Creates instance of the GridFsStorage that will connect to specified mongo url
   * @param mongoConnectionURl - MongoDB connection url
   */
  constructor(mongoConnectionUrl: string) {
    const self = this;
    MongoClient.connect(mongoConnectionUrl, function(err, connection) {
      if (err) {
        getLogger().error('Cannot connect to mongodb server. Gridfs storage will be disabled');
        return;
      }
      self.gridFileSystem = gridfs(connection, mongo);
    });
  }

  public writeFile(metadata: FileMetadata, fileLocation: string): Promise<string> {
    const self = this;
    if (!self.gridFileSystem) {
      return BlueBird.reject('Not initialized');
    }
    const options = {
      filename: metadata.id
    };
    return new BlueBird(function(resolve, reject) {
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
      return BlueBird.reject('Not initialized');
    }
    const options = {
      filename: id
    };
    return new BlueBird(function(resolve, reject) {
      const readstream = self.gridFileSystem.createReadStream(options);
      readstream.on('error', function(err) {
        getLogger().error('An error occurred when reading file from gridfs!', err);
        reject(err);
      });
      resolve(readstream);
    });
  }
}
