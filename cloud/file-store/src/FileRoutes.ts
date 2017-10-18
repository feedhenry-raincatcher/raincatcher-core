import { Router } from 'express';
import uuid from 'uuid-js';
import { FileStorage } from '../file-api/FileStorage';
import fileService from './services/File';

/**
 * Create express based router router for fileService
 *
 * @param {FileStorage} storageEngine - engine used to store files
 * @returns router instance of express router
 */
function initRouter(storageEngine: FileStorage) {
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
      const location = fileService.filePath(fileMeta.id);
      return storageEngine.writeFile(fileMeta.namespace, fileMeta.id, location);
    }).then(function() {
      res.json(fileMeta);
    }).catch(function(err) {
      next(err);
    });
  });

  const binaryUploadInitMiddleware = function(req, res, next) {
    req.fileMeta = {};
    req.fileMeta.id = uuid.create().toString();
    req.fileMeta.uid = req.fileMeta.id;
    req.fileMeta.name = req.body.fileName;
    req.fileMeta.namespace = req.body.namespace;
    req.fileMeta.owner = req.body.ownerId;
    req.fileMeta.mimetype = req.file.mimetype;
    next();
  };

  router.route('/:filename/binary').post(binaryUploadInitMiddleware, fileService.mutlerMiddleware,
    function(req, res, next) {
      const fileMeta = req.fileMeta;
      const location = fileService.filePath(fileMeta.uid);
      storageEngine.writeFile(fileMeta.namespace, fileMeta.uid, location).then(function() {
        return mediatorService.createFileMetadata(fileMeta);
      }).then(function() {
        res.json(fileMeta);
      }).catch(function(err) {
        console.log(err);
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
        res.sendFile(fileService.filePath(fileName));
      }
    });
  });
  return router;
}
