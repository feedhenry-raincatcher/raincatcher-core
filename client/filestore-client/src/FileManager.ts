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
   * Creates a new FileManager
   *
   * @param serverUrl - Server url used for downloading and uploading files to.
   * @param name - A name for a file queue
   * @param httpInterface - An HTTP interface for making network requests
   *
   * @see HttpClient
   */
  public constructor(private serverUrl: string, private name: string, private httpInterface: HttpClient) {
    this.uploadQueue = new FileQueue(window.localStorage, name + '-upload');
    this.downloadQueue = new FileQueue(window.localStorage, name + '-download');
    this.fileSupport = new CordovaFileSupport(serverUrl, httpInterface);

    // Start processing uploads and downloads on startup
    this.startProcessingUploads();
    this.startProcessingDownloads();

    // Listen when client becomes online for uploads and downloads
    const self = this;
    document.addEventListener('online', function() {
      self.startProcessingUploads();
      self.startProcessingDownloads();
    });
  }

  /**
   * Adds a file to the upload queue. Files are only uploaded when the device is online.
   *
   * @param file - Contains required information for uploading a file
   *
   * @see FileQueueEntry
   */
  public scheduleFileToBeUploaded(file: FileQueueEntry) {
    const self = this;
    return this.fileSupport.uploadFile(file).then(function(result) {
      return Bluebird.resolve(result);
    }).catch(function(err) {
      // Adds a file to the upload queue
      self.uploadQueue.addItem(file);
    });
  }

  /**
   * Adds a file to the download queue. Files are only downloaded when the device is online.
   *
   * @param file - Contains required information for uploading a file
   *
   * @see FileQueueEntry
   */
  public scheduleFileToBeDownloaded(file: FileQueueEntry) {
    const self = this;
    if (file.id) {
      return this.fileSupport.downloadFileFromServer(file).then(function(result) {
        return Bluebird.resolve(result);
      }).catch(function(err) {
        // Adds a file to the upload queue if file is not available.
        self.uploadQueue.addItem(file);
      });
    }
  }

  /**
   * Starts the process of uploading files to the server.
   */
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

  /**
   * Starts the process of downloading files from the server.
   */
  private startProcessingDownloads() {
    const self = this;
    const queueItems: FileQueueEntry[] = this.downloadQueue.restoreData().getItemList();
    if (queueItems && queueItems.length > 0) {
      console.info('Processing offline file upload queue. Number of items to download: ', queueItems.length);
      Bluebird.map<FileQueueEntry, string | undefined>(queueItems, file => {
        if (file.id) {
          return self.fileSupport.downloadFileFromServer(file);
        }
      }, { concurrency: 1 });
    } else {
      console.info('Offline downloads file queue is empty');
    }
  }

  /**
   * Uploads the file to the server. Once the file has been successfully uploaded, it is removed
   * from the queue.
   *
   * @param file - Contains information required to upload a file to the server.
   */
  private saveFile(file: FileQueueEntry) {
    const self = this;
    return this.fileSupport.uploadFile(file).then(function(createdFile) {
      self.uploadQueue.removeItem(file);
      console.info('File saved', createdFile);
    }).catch(function(err) {
      // Adds file to the upload queue
      self.uploadQueue.addItem(file);
    });
  }
}
