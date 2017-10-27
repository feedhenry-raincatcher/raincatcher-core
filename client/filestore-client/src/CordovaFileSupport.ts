import * as Bluebird from 'bluebird';
import { HttpClient } from './HttpClient';

/**
 * Executes low level cordova file operations for downloading and uploading files to the server.
 */
export class CordovaFileSupport {
  constructor(private url: string, private httpClient: HttpClient) {
  }

  /**
   * Download files from server
   * @param id identifier for the file
   * @param fileURI - target location to save the file
   */
  public downloadFileFromServer(id: string, fileURI: string): Bluebird<string> {
    const self = this;
    // tslint:disable-next-line:max-line-length
    return new Bluebird<FileSystem>((resolve, reject) => window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, resolve, reject))
      .then(fs => new Bluebird<FileEntry>((resolve, reject) =>
        fs.root.getFile(fileURI, { create: true, exclusive: false }, resolve, reject)))
      .then(fileEntry => {
        return self.httpClient.download(self.url + '/' + id)
          .then(response => response.blob()).then(blob => window.URL.createObjectURL(blob));
      });
  }

  /**
   * Upload file using local file URI. Used for uploads on mobile devices (cordova based)
   *
   * @param fileURI - contains source location for the file that will be send to the server
   */
  public uploadFile(fileURI: string): Promise<Response> {
    const self = this;
    return new Bluebird<FileEntry>((resolve, reject) => window.resolveLocalFileSystemURL(fileURI, function(entry) {
      // bug in the file plugin definition?
      resolve(entry as FileEntry);
    }, reject)).then(fileEntry => new Bluebird<Response>(function(resolve, reject) {
      fileEntry.file(function(file) {
        const reader = new FileReader();
        reader.onloadend = function() {
          // Create a blob based on the FileReader 'result', which we asked to be retrieved as an ArrayBuffer
          // TODO hardcoded type
          const blob = new Blob([new Uint8Array(this.result)], { type: 'image/jpg' });
          const data = new FormData();
          data.append('file', blob);
          return self.httpClient.upload(self.url, data).then(resolve).catch(reject);
        };
        reader.readAsArrayBuffer(file);
      }, reject);
    }));
  }
}
