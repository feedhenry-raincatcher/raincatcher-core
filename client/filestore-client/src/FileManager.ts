import * as Bluebird from 'bluebird';
import * as _ from 'lodash';
import { uploadFile } from './CordovaFileUpload';
import { FileQueue } from './FileQueue';
import { uploadDataUrl } from './UriFileUpload';

/**
 * Manager for file uploads
 */
export class FileManager {
  private uploadQueue;

  public constructor(private baseUrl: string, private httpService, name: string) {
    this.uploadQueue = new FileQueue(name);
    // Start processing uploads on startup
    this.startProcessingUploads();
    // Listen when client becomes online for uploads
    const self = this;
    document.addEventListener('online', function() {
      self.startProcessingUploads();
    });
  }

  public startProcessingUploads() {
    const queueItems = this.uploadQueue.restoreData().getItemList();
    const self = this;
    if (queueItems && queueItems.length > 0) {
      console.info('Processing offline file queue. Number of items to save: ', queueItems.length);
      let promise = this.saveFile(queueItems[0]).then(function() {
        _.each(queueItems, function(item) {
          promise = promise.then(function() {
            return self.saveFile(item);
          });
        });
      });
    } else {
      console.info('Offline file queue is empty');
    }
  }

  public saveFile(queueItem) {
    const self = this;
    return self.createFile(queueItem).then(function(createdFile) {
      this.uploadQueue.removeFromQueue(queueItem);
      console.info('File saved', createdFile);
    });
  }

  /**
   * Add file to upload queue. File would be uploaded depending on internet connectivity.
   *
   * @param file {userId, fileURI, options, dataUrl}
   * @returns {*}
   */
  public scheduleFileToBeUploaded(file: any) {
    const self = this;
    return this.createFile(file).then(function(result) {
      return Bluebird.resolve(result);
    }).catch(function(err) {
      // Add item to queue
      self.uploadQueue.addQueueItem(file);
      return Bluebird.resolve('QUEUED');
    });
  }

  /**
   * Upload file to server.
   * Function would choose right method depending on parameters.
   *
   * @param file {userId, fileURI, options, dataUrl}
   * @returns {*}
   */
  public createFile(file) {
    if (file.fileURI && file.options) {
      return uploadFile(this.baseUrl, file.userId, file.fileURI, file.options);
    } else if (file.dataUrl) {
      return uploadDataUrl(this.baseUrl, this.httpService, file.userId, file.dataUrl);
    } else {
      return Bluebird.reject('Missing required fields for file object');
    }
  }
}
