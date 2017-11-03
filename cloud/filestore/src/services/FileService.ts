import { getLogger } from '@raincatcher/logger';
import * as base64 from 'base64-stream';
import { Request } from 'express';
import * as fs from 'fs';
import multer = require('multer');
import * as  os from 'os';
import { join } from 'path';
import * as path from 'path';
import q from 'q';
import { Stream } from 'stream';
import through from 'through2';
import { FileMetadata } from '../file-api/FileMetadata';

/**
 * Location of the stored files in the server's local disk
 * Uses the OS' temporary directory
 */
export const FILE_STORAGE_DIRECTORY = path.join(os.tmpdir(), '/raincatcher-file-store');

/**
 * Create temporary storage folder used by multer to store files before
 * uploading to permanent storage
 */
export function createTemporaryStorageFolder() {
  fs.mkdir(FILE_STORAGE_DIRECTORY, '0775', function(err: any) {
    if (err && err.code !== 'EEXIST') {
      getLogger().error(err);
      throw new Error(err);
    }
  });
}

/**
 * Utility function for saving file in temp folder
 * @param metadata
 * @param stream
 */
export function writeStreamToFile(metadata: FileMetadata, stream: Stream) {
  const deferred = q.defer();
  stream.on('end', function() {
    deferred.resolve(metadata);
  });
  stream.on('error', function(error) {
    deferred.reject(error);
  });
  const filename = path.join(FILE_STORAGE_DIRECTORY, metadata.id);
  stream.pipe(fs.createWriteStream(filename));
  return deferred.promise;
}

/**
 * Returns the full path to a file stored with the service
 * @param fileName Name of the file to build a path for, usually the file's id
 */
export function buildFilePath(fileName) {
  return path.join(FILE_STORAGE_DIRECTORY, fileName);
}

/**
 * Returns a new multer-based middleware that's capable of processing the `multipart/form-data` uploads
 */
export function multerMiddleware() {
  return multer({
    storage: multer.diskStorage({
      destination(req, file, cb) {
        cb(null, FILE_STORAGE_DIRECTORY);
      }
    })
  });
}
