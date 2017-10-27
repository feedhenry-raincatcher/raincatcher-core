import * as Bluebird from 'bluebird';
import * as _ from 'lodash';
import { downloadFileFromServer, uploadFile } from './CordovaFileSupport';
import { FileQueue } from './FileQueue';
import { FileQueueEntry } from './FileQueueEntry';

export interface HttpClient {
  upload: (url: string, data: FormData) => Promise<Response>;
}

/**
 * Manager for file uploads
 */
export class FileManager {

  private uploadQueue: FileQueue;
  private downloadQueue: FileQueue;

  public constructor(private serverUrl: string, private httpClient: HttpClient, name: string) {
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
  public scheduleFileToBeUploaded(file: FileQueueEntry) {
    const self = this;
    return uploadFile(this.serverUrl, file, this.httpClient.upload).then(function(result) {
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
  public scheduleFileToBeDownloaded(file: FileQueueEntry) {
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
    const queueItems: FileQueueEntry[] = this.uploadQueue.restoreData().getItemList();
    const self = this;
    if (queueItems && queueItems.length > 0) {
      console.info('Processing offline upload file queue. Number of items to save: ', queueItems.length);
      Bluebird.map<FileQueueEntry, void>(queueItems, file => {
        return self.saveFile(file);
      }, { concurrency: 1 });
    } else {
      console.info('Offline uploads file queue is empty');
    }
  }

  private startProcessingDownloads() {
    const queueItems: FileQueueEntry[] = this.downloadQueue.restoreData().getItemList();
    if (queueItems && queueItems.length > 0) {
      console.info('Processing offline file upload queue. Number of items to download: ', queueItems.length);
      Bluebird.map<FileQueueEntry, string | undefined>(queueItems, file => {
        if (file.id) {
          return downloadFileFromServer(this.serverUrl, file.id, file.uri);
        }
      }, { concurrency: 1 });
    } else {
      console.info('Offline downloads file queue is empty');
    }
  }

  private saveFile(file: FileQueueEntry) {
    const self = this;
    return uploadFile(this.serverUrl, file, this.httpClient.upload).then(function(createdFile) {
      self.uploadQueue.removeItem(file);
      console.info('File saved', createdFile);
    });
  }
}
