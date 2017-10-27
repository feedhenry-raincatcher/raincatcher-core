/**
 * Contains required fields required to save file
 */
export interface FileQueueEntry {
  /**
   * Uri to local filesystem containing file
   */
  uri: string;
  id?: string;
}
