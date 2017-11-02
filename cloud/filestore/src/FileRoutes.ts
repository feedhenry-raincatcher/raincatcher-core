import { getLogger } from '@raincatcher/logger';
import { promisify } from 'bluebird';
import { Router } from 'express';
import { Request } from 'express';
import { rename } from 'fs';
import * as uuid from 'uuid-js';
import { FileMetadata } from './file-api/FileMetadata';
import { FileStorage } from './file-api/FileStorage';
import * as fileService from './services/FileService';

const renameAsync = promisify(rename);

type SingleFileRequest = Request & {
  file: {
    path: string
  }
};

/**
 * Create express based router router for fileService
 *
 * @param {FileStorage} storageEngine - engine used to store files
 * @returns router instance of express router
 */
export function createRouter(storageEngine: FileStorage) {

  fileService.createTemporaryStorageFolder();
  const router = Router();
  router.route('/').post(fileService.multerMiddleware().single('file'),
    function(req: SingleFileRequest, res, next) {
      debugger;
      const id = req.body.id;
      const metadata: FileMetadata = {
        id
      };
      // Move file from generated path to id
      // We can't rely on multer's DiskStorage destination config since req.body.id might not be populated earlier
      const location = fileService.buildFilePath(id);
      return renameAsync(req.file.path, location)
      .then(() => storageEngine.writeFile(metadata, location))
      .then(() => res.json(metadata))
      .catch(function(err) {
        getLogger().error(err);
        next(err);
      });
    });

  router.route('/:id').get(function(req, res) {
    const fileName = req.params.id;
    storageEngine.readFile(fileName).then(function(buffer) {
      if (buffer) {
        buffer.pipe(res);
      } else {
        res.sendFile(fileService.buildFilePath(fileName));
      }
    });
  });
  return router;
}
