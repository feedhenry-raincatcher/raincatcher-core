import { getLogger } from '@raincatcher/logger';
import * as base64 from 'base64-stream';
import * as Promise from 'bluebird';
import { Request } from 'express';
import * as fs from 'fs';
import * as mkdirp from 'mkdirp';
import * as multer from 'multer';
import * as os from 'os';
import { join } from 'path';
import * as path from 'path';
import { Stream } from 'stream';
import { FileMetadata } from '../file-api/FileMetadata';

const mkdirpAsync = Promise.promisify<string, string>(mkdirp);

/**
 * Location of the stored files in the server's local disk
 * Uses the OS' temporary directory
 */
export const FILE_STORAGE_DIRECTORY = path.join(os.tmpdir(), '/raincatcher-file-store');

/**
 * Create temporary storage folder used by multer to store files before
 * uploading to permanent storage
 */
export function createTemporaryStorageFolder(directory: string = FILE_STORAGE_DIRECTORY): Promise<string> {
  return mkdirpAsync(directory).then(() => directory);
}

/**
 * Utility function for saving file in temp folder
 * @param metadata
 * @param stream
 */
export function writeStreamToFile(metadata: FileMetadata, stream: Stream): Promise<FileMetadata> {
  return new Promise((resolve, reject) => {
    stream.on('end', function() {
      resolve(metadata);
    });
    stream.on('error', function(error) {
      reject(error);
    });
    const filename = buildFilePath(metadata.id);
    stream.pipe(fs.createWriteStream(filename));
  });
}

/**
 * Returns the full path to a file stored with the service
 * @param fileName Name of the file to build a path for, usually the file's id
 */
export function buildFilePath(fileName: string, root: string = FILE_STORAGE_DIRECTORY) {
  return path.join(root, fileName);
}

const diskStorageDefaultOptions = {
  destination(req, file, cb) {
    cb(null, FILE_STORAGE_DIRECTORY);
  }
};

export function multerMiddleware(storage: multer.StorageEngine = multer.diskStorage(diskStorageDefaultOptions)) {
  return multer({
    storage
  });
}
