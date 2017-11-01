import { getLogger } from '@raincatcher/logger';
import { Router } from 'express';
import { Request } from 'express';
import * as uuid from 'uuid-js';
import { FileMetadata } from './file-api/FileMetadata';
import { FileStorage } from './file-api/FileStorage';
import * as fileService from './services/FileService';

interface FileMetadataRequest extends Request {
  fileMeta: FileMetadata;
}

/**
 * Create express based router router for fileService
 *
 * @param {FileStorage} storageEngine - engine used to store files
 * @returns router instance of express router
 */
export function createRouter(storageEngine: FileStorage) {

  const generateIdMiddleware = function(req, res, next) {
    req.fileMeta = {};
    req.fileMeta.id = uuid.create().toString();
    next();
  };

  fileService.createTemporaryStorageFolder();
  const router = Router();
  router.route('/base64').post(generateIdMiddleware, function(req: FileMetadataRequest, res, next) {
    const stream = fileService.parseBase64Stream(req);
    const fileMeta: FileMetadata = req.fileMeta;
    fileService.writeStreamToFile(fileMeta, stream).then(function() {
      const location = fileService.buildFilePath(fileMeta.id);
      return storageEngine.writeFile(fileMeta, location);
    }).then(function() {
      res.json(fileMeta);
    }).catch(function(err) {
      getLogger().error(err);
      next(err);
    });
  });

  router.route('/binary').post(generateIdMiddleware, fileService.multerMiddleware(),
    function(req: FileMetadataRequest, res, next) {
      const fileMeta = req.fileMeta;
      const location = fileService.buildFilePath(fileMeta.id);
      storageEngine.writeFile(fileMeta, location).then(function() {
        res.json(fileMeta);
      }).catch(function(err) {
        getLogger().error(err);
        next(err);
      });
    });

  router.route('/binary/:filename').get(function(req, res) {
    const fileName = req.params.filename;
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
