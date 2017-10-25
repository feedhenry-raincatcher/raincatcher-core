import { getLogger } from '@raincatcher/logger';
import { Router } from 'express';
import uuid = require('uuid-js');
import { FileStorage } from './file-api/FileStorage';
import * as fileService from './services/FileService';

/**
 * Create express based router router for fileService
 *
 * @param {FileStorage} storageEngine - engine used to store files
 * @returns router instance of express router
 */
export function createRouter(storageEngine: FileStorage) {
  const router = Router();
  router.route('/:filename').post(function(req, res, next) {
    const id = uuid.create().toString();
    const fileMeta = {
      owner: req.params.owner,
      name: req.params.filename,
      namespace: req.params.namespace,
      id
    };
    const stream = fileService.parseBase64Stream(req);
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

  const binaryUploadInitMiddleware = function(req, res, next) {
    req.fileMeta = {};
    req.fileMeta.id = uuid.create().toString();
    req.fileMeta.name = req.body.fileName;
    req.fileMeta.namespace = req.body.namespace;
    req.fileMeta.owner = req.body.ownerId;
    req.fileMeta.mimetype = req.file.mimetype;
    next();
  };

  router.route('/:filename/binary').post(binaryUploadInitMiddleware, fileService.mutlerMiddleware,
    function(req: any, res, next) {
      const fileMeta = req.fileMeta;
      const location = fileService.buildFilePath(fileMeta.id);
      storageEngine.writeFile(fileMeta, location).then(function() {
        res.json(fileMeta);
      }).catch(function(err) {
        getLogger().error(err);
        next(err);
      });
    });

  router.route('/:filename').get(function(req, res) {
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
