import * as Bluebird from 'bluebird';
import * as _ from 'lodash';
import { downloadFileFromServer, uploadFile } from './CordovaFileSupport';
import { FileQueue } from './FileQueue';

/**
 * Contains required fields required to save file
 */
export interface FileEntry {
  /**
   * Uri to local filesystem containing file
   */
  uri: string;
}

/**
 * Manager for file uploads
 */
export class FileManager {

  private uploadQueue;
  private downloadQueue;

  public constructor(private serverUrl: string, name: string) {
    this.uploadQueue = new FileQueue(window.localStorage, name + '-upload');
    this.downloadQueue = new FileQueue(window.localStorage, name + '-download');
    // Start processing uploads on startup
    this.startProcessingUploads();
    this.startProcessingDownloads();
    // Listen when client becomes online for uploads
    const self = this;
    document.addEventListener('online', function() {
      self.startProcessingUploads();
      self.startProcessingDownloads();
    });
  }

  /**
   * Add file to upload queue. File would be uploaded depending on internet connectivity.
   *
   * @param file file metadata to be saved
   * @returns {*}
   */
  public scheduleFileToBeUploaded(file: FileEntry) {
    const self = this;
    return this.createFile(file.uri).then(function(result) {
      return Bluebird.resolve(result);
    }).catch(function(err) {
      // Add item to queue
      self.uploadQueue.addQueueItem(file);
      return Bluebird.resolve('QUEUED');
    });
  }

  /**
   * Add file to download queue. File would be downloaded to local file system depending on internet connectivity.
   *
   * @returns {*}
   */
  public scheduleFileToBeDownloaded(fileId: string) {
    const self = this;
    return this.createFile(fileId).then(function(result) {
      return Bluebird.resolve(result);
    }).catch(function(err) {
      // Add item to queue
      self.uploadQueue.addQueueItem(fileId);
      return Bluebird.resolve('QUEUED');
    });
  }

  private startProcessingUploads() {
    const queueItems = this.uploadQueue.restoreData().getItemList();
    const self = this;
    if (queueItems && queueItems.length > 0) {
      console.info('Processing offline upload file queue. Number of items to save: ', queueItems.length);
      Bluebird.map(queueItems, file => self.saveFile(file), { concurrency: 1 });
    } else {
      console.info('Offline file queue is empty');
    }
  }

  private startProcessingDownloads() {
    const queueItems = this.downloadQueue.restoreData().getItemList();
    const self = this;
    if (queueItems && queueItems.length > 0) {
      console.info('Processing offline file upload queue. Number of items to download: ', queueItems.length);
      Bluebird.map(queueItems, file => self.downloadFile(file), { concurrency: 1 });
    } else {
      console.info('Offline file queue is empty');
    }
  }

  private saveFile(queueItem) {
    const self = this;
    return self.createFile(queueItem).then(function(createdFile) {
      this.uploadQueue.removeFromQueue(queueItem);
      console.info('File saved', createdFile);
    });
  }

  /**
   * Upload file to server.
   * Function would choose right method depending on parameters.
   *
   * @param file {fileURI, dataUrl}
   * @returns {*}
   */
  private createFile(file: string) {
    return uploadFile(this.serverUrl, file);
  }

  /**
   * Upload file to server.
   * Function would choose right method depending on parameters.
   *
   * @param fileId
   * @returns {*}
   */
  private downloadFile(fileId) {
    return downloadFileFromServer(this.serverUrl, fileId);
  }
}
