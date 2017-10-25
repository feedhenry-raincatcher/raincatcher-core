import * as Bluebird from 'bluebird';

/**
* @param url
* @param fileId
*/
export function downloadFileFromServer(url, fileId) {
  return new Bluebird<FileSystem>((resolve, reject) => window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, resolve, reject))
  .then(fs => new Bluebird<FileEntry>((resolve, reject) =>
    fs.root.getFile(fileId, { create: true, exclusive: false }, resolve, reject)))
  .then(fileEntry => {
    return fetch(url).then(response => response.blob()).then(blob => window.URL.createObjectURL(blob));
  });
};

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
