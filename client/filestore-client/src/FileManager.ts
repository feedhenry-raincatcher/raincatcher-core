import * as Bluebird from 'bluebird';
import * as _ from 'lodash';
import { CordovaFileSupport } from './CordovaFileSupport';
import { FileQueue } from './FileQueue';
import { FileQueueEntry } from './FileQueueEntry';
import { HttpClient } from './HttpClient';

/**
 * Manager for file uploads
 */
export class FileManager {

  private uploadQueue: FileQueue;
  private downloadQueue: FileQueue;
  private fileSupport: CordovaFileSupport;
  /**
   * Create new FileManager
   *
   * @param serverUrl - server url used to save images
   * @param name name for the queues
   * @param httpInterface interface for making network requests
   */
  public constructor(private serverUrl: string, private name: string, private httpInterface: HttpClient) {
    this.uploadQueue = new FileQueue(window.localStorage, name + '-upload');
    this.downloadQueue = new FileQueue(window.localStorage, name + '-download');
    this.fileSupport = new CordovaFileSupport(serverUrl, httpInterface);

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
    return this.fileSupport.uploadFile(file.uri).then(function(result) {
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
      return this.fileSupport.downloadFileFromServer(file.id, file.uri).then(function(result) {
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
        return self.saveFile(file.uri);
      }, { concurrency: 1 });
    } else {
      console.info('Offline uploads file queue is empty');
    }
  }

  private startProcessingDownloads() {
    const self = this;
    const queueItems: FileQueueEntry[] = this.downloadQueue.restoreData().getItemList();
    if (queueItems && queueItems.length > 0) {
      console.info('Processing offline file upload queue. Number of items to download: ', queueItems.length);
      Bluebird.map<FileQueueEntry, string | undefined>(queueItems, file => {
        if (file.id) {
          return self.fileSupport.downloadFileFromServer(file.id, file.uri);
        }
      }, { concurrency: 1 });
    } else {
      console.info('Offline downloads file queue is empty');
    }
  }

  private saveFile(fileUri: string) {
    const self = this;
    return this.fileSupport.uploadFile(fileUri).then(function(createdFile) {
      self.uploadQueue.removeItem(fileUri);
      console.info('File saved', createdFile);
    });
  }
}
