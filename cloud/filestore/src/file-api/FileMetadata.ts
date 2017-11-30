/**
 * @module @raincatcher/filestore
 */

/**
 * Interface contains documented fields that can be used by implementation to save and query files.
 * Actual implementation can use any other fields that are required to be saved along with the file.
 */
export interface FileMetadata {
  /**
   * Identifier for the saved file. It needs to be unique to represent file in the storage.
   * It's recommended to use UUID generated strings for the file id.
   */
  id: string;
}
