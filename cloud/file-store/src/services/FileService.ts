var base64 = require('base64-stream');
var path = require("path");
var q = require("q");
var through = require('through2');
var os = require('os');
var fs = require('fs');
var multer = require('multer');

var imageDir = os.tmpdir() + '/raincatcher-file-store';

/**
 * Create temporary storage folder used by mutler to store files before
 * uploading to permanent storage
 */
function createTemporaryStorageFolder() {
  fs.mkdir(imageDir, '0775', function(err) {
    if (err && err.code !== 'EEXIST') {
      console.log(err);
      throw new Error(err);
    }
  });
}

/**
 * Utility function for saving file in temp folder
 * @param fileMeta
 * @param stream
 */
function writeStreamToFile(fileMeta, stream) {
  var deferred = q.defer();
  stream.on('end', function() {
    deferred.resolve(fileMeta);
  });
  stream.on('error', function(error) {
    deferred.reject(error);
  });
  var filename = imageDir + '/' + fileMeta.uid;
  stream.pipe(fs.createWriteStream(filename));
  return deferred.promise;
}

/**
 * Parse Base64 URL into stream that can be saved as file.
 *
 * @param req
 */
function parseBase64Stream(req) {
  var passthrough = false;
  var accumulation = '';
  var stream = req.pipe(through(function(chunk, enc, callback) {
    if (!passthrough) {
      accumulation += chunk;
      var test = ';base64,';
      var index = accumulation.indexOf(test);
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

function buildFilePath(fileName) {
  return path.join(imageDir, fileName);
}

function mutlerMiddleware() {
  return multer({
    storage: multer.diskStorage({
      destination: function(req, file, cb) {
        cb(null, imageDir);
      },
      filename: function(req, file, cb) {
        cb(null, req.fileMeta.uid);
      }
    })
  }).single('binaryfile');
}

/**
 * Util class for file operations
 *
 * @type {{
 *         imageDir: string,
 *         writeStreamToFile: function,
 *         parseBase64Stream: function,
 *         createTemporaryStorageFolder: function,
 *         filePath: function,
 *         mutlerMiddleware: mutlerMiddleware
 * }}
 */
module.exports = {
  imageDir: imageDir,
  writeStreamToFile: writeStreamToFile,
  parseBase64Stream: parseBase64Stream,
  createTemporaryStorageFolder: createTemporaryStorageFolder,
  filePath: buildFilePath,
  mutlerMiddleware: mutlerMiddleware
};
