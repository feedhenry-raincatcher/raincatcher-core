import * as Bluebird from 'bluebird';

// TODO documentation
/**
 * Upload file using local file URI. Used for uploads on mobile devices (cordova based)
 *
 * @param baseUrl
 * @param userId
 * @param options
 * @returns {*}
 */
export function uploadFile(url, fileURI) {
  if (arguments.length < 2) {
    return Bluebird.reject('userId and fileURI parameters are required.');
  } else {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs) {
      console.info('file system open: ' + fs.name);
      // TODO support metadata here
      fs.root.getFile(fileURI, { create: true, exclusive: false }, function(fileEntry) {
        fileEntry.file(function(file) {
          const reader = new FileReader();
          reader.onloadend = function() {
            // Create a blob based on the FileReader "result", which we asked to be retrieved as an ArrayBuffer
            const blob = new Blob([new Uint8Array(this.result)], { type: 'image/png' });
            const oReq = new XMLHttpRequest();
            oReq.open('POST', url, true);
            oReq.onload = function(oEvent) {
              // all done!
            };
            // Pass the blob in to XHR's send method
            oReq.send(blob);
          };
          // Read the file as an ArrayBuffer
          reader.readAsArrayBuffer(file);
        }, function(err) { console.error('error getting fileentry file!' + err); });
      }, function(err) { console.error('error getting file! ' + err); });
    }, function(err) { console.error('error getting persistent fs! ' + err); });
  }
}
