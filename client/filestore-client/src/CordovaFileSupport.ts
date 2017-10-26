import * as Bluebird from 'bluebird';

/**
 * @param url
 * @param fileId
 */
export function downloadFileFromServer(url: string, id: string, fileURI: string): Bluebird<string> {
  // tslint:disable-next-line:max-line-length
  return new Bluebird<FileSystem>((resolve, reject) => window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, resolve, reject))
    .then(fs => new Bluebird<FileEntry>((resolve, reject) =>
      fs.root.getFile(fileURI, { create: true, exclusive: false }, resolve, reject)))
    .then(fileEntry => {
      return fetch(url + '/' + id)
        .then(response => response.blob()).then(blob => window.URL.createObjectURL(blob));
    });
}

/**
 * Upload file using local file URI. Used for uploads on mobile devices (cordova based)
 */
export function uploadFile(url: string, fileURI: string): Promise<Response> {
  if (arguments.length < 2) {
    return Bluebird.reject('userId and fileURI parameters are required.');
  }

  return new Bluebird<FileEntry>((resolve, reject) => window.resolveLocalFileSystemURL(fileURI, function(entry) {
    // bug in the file plugin definition?
    resolve(entry as FileEntry);
  }, reject)).then(fileEntry => new Bluebird<Response>(function(resolve, reject) {
      fileEntry.file(function(file) {
        const reader = new FileReader();
        reader.onloadend = function() {
          // Create a blob based on the FileReader 'result', which we asked to be retrieved as an ArrayBuffer
          const blob = new Blob([new Uint8Array(this.result)], { type: 'image/jpg' });
          const data = new FormData();
          data.append('file', blob);
          return fetch(url, {
            method: 'post',
            body: data
          }).then(resolve).catch(reject);
        };
        reader.readAsArrayBuffer(file);
      }, reject);
    }));
}
