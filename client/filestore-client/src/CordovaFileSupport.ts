/**
 * @module @raincatcher/filestore-client
 */

import b64ToBlob from 'b64-to-blob';
import * as Bluebird from 'bluebird';
import { each } from 'lodash';
import { FileQueueEntry } from './FileQueueEntry';
import { HttpClient } from './HttpClient';

/**
 * Executes a low level cordova file operation for downloading and uploading files to the server.
 */
export class CordovaFileSupport {

  /**
   * Creates a cordova file support instance
   *
   * @param url - URL used for uploading to and downloading a file.
   * @param httpClient - An implementation of the HTTP client interface.
   *
   * @see HttpClient
   */
  constructor(private url: string, private httpClient: HttpClient) {
  }

  /**
   * Downloads a file from a server
   *
   * @param file - Contains information required to download a file
   *
   * @see FileQueueEntry
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
   * Uploads a file on a mobile device to a server. (cordova based)
   *
   * @param file - Contains information required to upload a file
   *
   * @see FileQueueEntry
   */
  public uploadFile(file: FileQueueEntry): Bluebird<Response> {
    const self = this;
    if (file.type === 'uri') {
      return this.uploadFromFilePath(file);
    } else {
      return this.uploadWithBlob(file, this.dataUriToBlob(file.uri));
    }
  }

  /**
   * Transforms a base64 file to a blob.
   *
   * @param dataURI - A base64 file.
   */
  protected dataUriToBlob(dataURI: string): Blob {
    const data = dataURI.split(',')[1];

    // separate out the mime component
    const mimeType = dataURI.split(',')[0].split(':')[1].split(';')[0];

    return b64ToBlob(data, mimeType);
  }

  /**
   * Uploads a file to a server from the file path on a mobile device.
   *
   * @param file - Contains information required to upload a file to a server.
   *
   * @see FileQueueEntry
   */
  protected uploadFromFilePath(file: FileQueueEntry) {
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
          return self.uploadWithBlob(file, blob).then(resolve, reject);
        };
        reader.readAsArrayBuffer(localFile);
      }, reject);
    }));
  }

  /**
   * Upload a blob file to a server.
   *
   * @param file - Contains information required to upload a file to a server.
   * @param blob - A file blob
   *
   * @see FileQueueEntry
   */
  protected uploadWithBlob(file: FileQueueEntry, blob: Blob) {
    const data = new FormData();
    data.append('file', blob);
    each(file, function(value, key) {
      if (value) {
        data.append(key, value);
      }
    });
    return this.httpClient.upload(this.url, data);
  }
}
