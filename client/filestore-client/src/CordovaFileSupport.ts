import * as Bluebird from 'bluebird';

/**
 * @param url
 * @param fileId
 */
export function downloadFileFromServer(url, fileId) {
  window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs) {
    console.info('file system open: ' + fs.name);
    fs.root.getFile(fileId, { create: true, exclusive: false }, function(fileEntry) {
      console.info('fileEntry is file? ' + fileEntry.isFile.toString());
      const oReq = new XMLHttpRequest();
      // Make sure you add the domain name to the Content-Security-Policy <meta> element.
      oReq.open('GET', url + '/' + fileId, true);
      // Define how you want the XHR data to come back
      oReq.responseType = 'blob';
      oReq.onload = function(oEvent) {
        const blob = oReq.response; // Note: not oReq.responseText
        if (blob) {
          // Create a URL based on the blob, and set an <img> tag's src to it.
          const objUrl = window.URL.createObjectURL(blob);
          // document.getElementById('bot-img').src = url;
          // Or read the data with a FileReader
          // var reader = new FileReader();
          // reader.addEventListener('loaded', function() {
          // reader.result contains the contents of blob as text
          // });
          // reader.readAsText(blob);
        } else {
          console.error('we didnt get an XHR response!');
        }
      };
      oReq.send(null);
    }, function(err) { console.error('error getting file! ' + err); });
  }, function(err) { console.error('error getting persistent fs! ' + err); });
}

/**
 * Upload file using local file URI. Used for uploads on mobile devices (cordova based)
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
            // Create a blob based on the FileReader 'result', which we asked to be retrieved as an ArrayBuffer
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
