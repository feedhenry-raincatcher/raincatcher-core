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
export function uploadFile(url, fileURI): Promise<Response> {
  if (arguments.length < 2) {
    return Bluebird.reject('userId and fileURI parameters are required.');
  }
  
  return new Bluebird<FileSystem>((resolve, reject)=> {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, resolve, function(err) {
      reject(new Error('error getting persistent fs! ' + err));
    });
  }).then(function(fs) {
    // TODO support metadata here
    return new Bluebird<FileEntry>((resolve, reject) => 
    fs.root.getFile(fileURI, { create: false, exclusive: false }, resolve, reject));
  }).then(function(fileEntry) {
    return new Bluebird<Response>(function(resolve, reject) {
      fileEntry.file(function(file) {
        const reader = new FileReader();
        reader.addEventListener("loadend", function() {
          // Create a blob based on the FileReader 'result', which we asked to be retrieved as an ArrayBuffer
          const blob = new Blob([new Uint8Array(this.result)], { type: 'image/jpg' });
          const data = new FormData();
          // data.append("other metadata", "Hello wtrocki!");
          data.append("file", blob);
          return fetch(url, {
            method: 'post',
            body: data
          }).then(resolve).catch(reject);
        });
        // Read the file as an ArrayBuffer
        reader.readAsArrayBuffer(file);
      }, reject);
    });
  });
}
