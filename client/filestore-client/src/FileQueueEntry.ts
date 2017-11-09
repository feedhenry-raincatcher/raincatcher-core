/**
 * Contains fields required for uploading and downloading a file.
 */
export interface FileQueueEntry {
  /**
   * File URI to local filesystem containing the file.
   */
  uri: string;

  /**
   * File type
   */
  type: 'uri'|'base64';

  /**
   * File identifier
   */
  id: string;
}
