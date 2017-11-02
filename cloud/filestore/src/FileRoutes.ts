import { getLogger } from '@raincatcher/logger';
import { Router } from 'express';
import { Request } from 'express';
import * as uuid from 'uuid-js';
import { FileMetadata } from './file-api/FileMetadata';
import { FileStorage } from './file-api/FileStorage';
import * as fileService from './services/FileService';

type FileMetadataRequest = Request & FileMetadata;

/**
 * Create express based router router for fileService
 *
 * @param {FileStorage} storageEngine - engine used to store files
 * @returns router instance of express router
 */
export function createRouter(storageEngine: FileStorage) {

  fileService.createTemporaryStorageFolder();
  const router = Router();
  router.route('/').post(fileService.multerMiddleware(),
    function(req: FileMetadataRequest, res, next) {
      const id = req.id;
      const metadata: FileMetadata = {
        id
      };
      const location = fileService.buildFilePath(id);
      storageEngine.writeFile(metadata, location).then(function() {
        res.json(metadata);
      }).catch(function(err) {
        getLogger().error(err);
        next(err);
      });
    });

  router.route('/:id').get(function(req, res) {
    const fileName = req.params.id;
    const namespace = req.params.namespace;
    storageEngine.streamFile(namespace, fileName).then(function(buffer) {
      if (buffer) {
        buffer.pipe(res);
      } else {
        res.sendFile(fileService.buildFilePath(fileName));
      }
    });
  });
  return router;
}
