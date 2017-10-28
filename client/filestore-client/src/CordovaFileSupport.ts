import * as Bluebird from 'bluebird';
import { FileQueueEntry } from './FileQueueEntry';
import { HttpClient } from './HttpClient';

/**
 * Executes low level cordova file operations for downloading and uploading files to the server.
 */
export class CordovaFileSupport {
  constructor(private url: string, private httpClient: HttpClient) {
  }

  /**
   * Download files from server
   */
  public downloadFileFromServer(file: FileQueueEntry): Bluebird<string> {
    const self = this;
    // tslint:disable-next-line:max-line-length
    return new Bluebird<FileSystem>((resolve, reject) => window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, resolve, reject))
      .then(fs => new Bluebird<FileEntry>((resolve, reject) =>
        fs.root.getFile(file.uri, { create: true, exclusive: false }, resolve, reject)))
      .then(fileEntry => {
        return self.httpClient.download(self.url + '/' + file.id)
          .then(response => response.blob()).then(blob => window.URL.createObjectURL(blob));
      });
  }

  /**
   * Upload file using local file URI. Used for uploads on mobile devices (cordova based)
   *
   * @param file - contains source location for the file that will be send to the server
   */
  public uploadFile(file: FileQueueEntry): Promise<Response> {
    const self = this;
    return new Bluebird<FileEntry>((resolve, reject) => window.resolveLocalFileSystemURL(file.uri, function(entry) {
      // bug in the file plugin definition?
      resolve(entry as FileEntry);
    }, reject)).then(fileEntry => new Bluebird<Response>(function(resolve, reject) {
      fileEntry.file(function(localFile) {
        const reader = new FileReader();
        reader.onloadend = function() {
          // Create a blob based on the FileReader 'result', which we asked to be retrieved as an ArrayBuffer
          // TODO hardcoded type
          const blob = new Blob([new Uint8Array(this.result)], { type: 'image/jpg' });
          const data = new FormData();
          data.append('file', blob);
          return self.httpClient.upload(self.url, data).then(resolve).catch(reject);
        };
        reader.readAsArrayBuffer(localFile);
      }, reject);
    }));
  }
}
