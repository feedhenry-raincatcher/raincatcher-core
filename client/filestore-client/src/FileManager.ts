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
  id?: string;
}

/**
 * Manager for file uploads
 */
export class FileManager {

  private uploadQueue: FileQueue;
  private downloadQueue: FileQueue;

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
    return uploadFile(this.serverUrl, file.uri).then(function(result) {
      return Bluebird.resolve(result);
    }).catch(function(err) {
      // Add item to queue
      self.uploadQueue.addItem(file);
    });
  }

  /**
   * Add file to download queue. File would be downloaded to local file system depending on internet connectivity.
   *
   * @returns {*}
   */
  public scheduleFileToBeDownloaded(file: FileEntry) {
    const self = this;
    if (file.id) {
      return downloadFileFromServer(this.serverUrl, file.id, file.uri).then(function(result) {
        return Bluebird.resolve(result);
      }).catch(function(err) {
        // Add item to queue
        self.uploadQueue.addItem(file);
      });
    }
  }

  private startProcessingUploads() {
    const queueItems: FileEntry[] = this.uploadQueue.restoreData().getItemList();
    const self = this;
    if (queueItems && queueItems.length > 0) {
      console.info('Processing offline upload file queue. Number of items to save: ', queueItems.length);
      Bluebird.map<FileEntry, void>(queueItems, file => {
        return self.saveFile(file.uri);
      }, { concurrency: 1 });
    } else {
      console.info('Offline uploads file queue is empty');
    }
  }

  private startProcessingDownloads() {
    const queueItems: FileEntry[] = this.downloadQueue.restoreData().getItemList();
    if (queueItems && queueItems.length > 0) {
      console.info('Processing offline file upload queue. Number of items to download: ', queueItems.length);
      Bluebird.map<FileEntry, string | undefined>(queueItems, file => {
        if (file.id) {
          return downloadFileFromServer(this.serverUrl, file.id, file.uri);
        }
      }, { concurrency: 1 });
    } else {
      console.info('Offline downloads file queue is empty');
    }
  }

  private saveFile(fileUri: string) {
    const self = this;
    return uploadFile(this.serverUrl, fileUri).then(function(createdFile) {
      self.uploadQueue.removeItem(fileUri);
      console.info('File saved', createdFile);
    });
  }
}
