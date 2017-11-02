import { Stream } from 'stream';
import { FileMetadata } from './FileMetadata';

/**
 * Interface used to retrieve file from the storage.
 * Implementors can relay on the interface to store or retrieve files stream.
 */
export interface FileStorage {

  /**
   * Write file that is saved in temporary local storage to the permanent storage.
   *
   * @param {FileMetadata} metadata for the file to be saved
   * @param {string} fileLocation - local filesystem location to the file
   */
  writeFile(metadata: FileMetadata, fileLocation: string): Promise<string>;

  /**
   * Retrieve file stream from storage
   *
   * @param {string} namespace - location (folder) used to place saved file.
   * @param {string} fileName - filename that should be unique within namespace
   */
  streamFile(namespace: string, fileName: string): Promise<Stream>;
}
