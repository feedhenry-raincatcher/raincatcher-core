import { getLogger } from '@raincatcher/logger';
import * as base64 from 'base64-stream';
import { Request } from 'express';
import * as fs from 'fs';
import multer = require('multer');
import * as  os from 'os';
import * as path from 'path';
import q from 'q';
import { Stream } from 'stream';
import through from 'through2';
import { FileMetadata } from '../file-api/FileMetadata';

const imageDir = os.tmpdir() + '/raincatcher-file-store';

/**
 * Create temporary storage folder used by mutler to store files before
 * uploading to permanent storage
 */
export function createTemporaryStorageFolder() {
  fs.mkdir(imageDir, '0775', function(err: any) {
    if (err && err.code !== 'EEXIST') {
      getLogger().error(err);
      throw new Error(err);
    }
  });
}

/**
 * Utility function for saving file in temp folder
 * @param fileMeta
 * @param stream
 */
export function writeStreamToFile(fileMeta: FileMetadata, stream: Stream) {
  const deferred = q.defer();
  stream.on('end', function() {
    deferred.resolve(fileMeta);
  });
  stream.on('error', function(error) {
    deferred.reject(error);
  });
  const filename = imageDir + '/' + fileMeta.id;
  stream.pipe(fs.createWriteStream(filename));
  return deferred.promise;
}

/**
 * Parse Base64 URL into stream that can be saved as file.
 *
 * @param req
 */
export function parseBase64Stream(req: Request) {
  let passthrough = false;
  let accumulation = '';
  const stream = req.pipe(through(function(chunk, enc, callback) {
    if (!passthrough) {
      accumulation += chunk;
      const test = ';base64,';
      const index = accumulation.indexOf(test);
      if (index > -1) {
        passthrough = true;
        chunk = accumulation.substr(index + test.length);
      }
    }
    if (passthrough) {
      this.push(chunk);
    }
    callback();
  }))
    .pipe(base64.decode());
  return stream;
}

export function buildFilePath(fileName) {
  return path.join(imageDir, fileName);
}

export function multerMiddleware() {
  return multer({
    storage: multer.diskStorage({
      destination(req, file, cb) {
        cb(null, imageDir);
      },
      filename(req, file, cb) {
        cb(null, req.fileMeta.id);
      }
    })
  }).any();
}
