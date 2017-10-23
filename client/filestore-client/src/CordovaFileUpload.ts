import * as Bluebird from 'bluebird';

// Cordova mocks for typescript
declare var FileUploadOptions: any;
declare var FileTransfer: any;

// Handling file upload to server
function fileUpload(fileURI, serverURI, fileUploadOptions) {
  const transfer = new FileTransfer();
  return new Bluebird(function(resolve, reject) {
    transfer.upload(fileURI, serverURI, function(response) {
      resolve(response);
    }, function uploadFailure(error) {
      reject(error);
    }, fileUploadOptions);
  });
}

// Handling retry mechanism of the file upload.
function fileUploadRetry(fileURI, serverURI, fileUploadOptions, timeout, retries) {
  return fileUpload(fileURI, serverURI, fileUploadOptions)
    .then(function(response) {
      return response;
    }, function() {
      if (retries === 0) {
        throw new Error('Cannot upload to file');
      }
      return Bluebird.delay(timeout)
        .then(function() {
          return fileUploadRetry(fileURI, serverURI, fileUploadOptions, timeout, retries - 1);
        });
    });
}

/**
 * Upload file using local file URI. Used for uploads on mobile devices (cordova based)
 *
 * @param baseUrl
 * @param userId
 * @param fileURI
 * @param options
 * @returns {*}
 */
export function uploadFile(baseUrl, userId, fileURI, options) {
  if (arguments.length < 2) {
    return Bluebird.reject('userId and fileURI parameters are required.');
  } else {
    options = options || {};
    const fileUploadOptions = new FileUploadOptions();
    fileUploadOptions.fileKey = options.fileKey || 'binaryfile';
    fileUploadOptions.fileName = options.fileName;
    fileUploadOptions.mimeType = options.mimeType || 'image/jpeg';
    fileUploadOptions.params = {
      ownerId: userId,
      fileName: options.fileName
    };
    const timeout = options.timeout || 2000;
    const retries = options.retries || 1;
    const serverURI = baseUrl + '/upload/binary';
    return fileUploadRetry(fileURI, serverURI, fileUploadOptions, timeout, retries);
  }
}
