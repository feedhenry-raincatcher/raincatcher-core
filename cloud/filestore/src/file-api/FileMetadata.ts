
/**
 * Interface contains documented fields that can be used by implementation to save and query files.
 * Actual implementation can use any other fields that are required to be saved along with the file.
 */
export interface FileMetadata {
  /**
   * Identifier for the saved file. It needs to be unique to represent file in the storage.
   * When using {namespace} field id needs to be unique in namespace.
   * It's recommended to use UUID generated strings for the file id.
   */
  id: string;

  /**
   * Original file name that can be restored and send back to user instead of the auto generated id.
   */
  originalName?: string;

  /**
   * Allows to categorize file. Depending on the implementation namespace can be represented as folder, bucket etc.
   */
  namespace?: string;

  /**
   * String representing file owner (it can be id/email etc.).
   */
  owner?: string;

  /**
   * Tags that can be used to query specific file.
   */
  tags?: string[];
}
