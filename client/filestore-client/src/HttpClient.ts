/**
 * @module @raincatcher/filestore-client
 */

import * as Promise from 'bluebird';

/**
 * Interface for making network requests for uploading and downloading files from a server.
 */
export interface HttpClient {
  /**
   * Upload a file to the server.
   *
   * @param url - URL to the file endpoint in the server.
   * @param data - Data containing the files and other metadata to be uploaded to the server.
   */
  upload: (url: string, data: FormData) => Promise<Response>;

  /**
   * Download a file from the server.
   *
   * @param url - URL to the file endpoint in the server
   */
  download: (url: string) => Promise<Response>;
}
