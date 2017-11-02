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

const fileStorageDir = path.join(os.tmpdir(), '/raincatcher-file-store');

/**
 * Create temporary storage folder used by mutler to store files before
 * uploading to permanent storage
 */
export function createTemporaryStorageFolder() {
  fs.mkdir(fileStorageDir, '0775', function(err: any) {
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
  const filename = path.join(fileStorageDir, metadata.id);
  stream.pipe(fs.createWriteStream(filename));
  return deferred.promise;
}

export function buildFilePath(fileName) {
  return path.join(fileStorageDir, fileName);
}

export function multerMiddleware() {
  return multer({
    storage: multer.diskStorage({
      destination(req, file, cb) {
        cb(null, fileStorageDir);
      },
      filename(req, file, cb) {
        cb(null, req.id);
      }
    })
  }).any();
}
