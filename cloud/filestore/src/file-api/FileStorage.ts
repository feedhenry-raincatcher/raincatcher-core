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
   * @param metadata for the file to be saved
   * @param fileLocation - full path to filesystem location
   */
  writeFile(metadata: FileMetadata, fileLocation: string): Promise<string>;

  /**
   * Retrieve file stream from storage
   *
   * @param id - filename that should match the one passed in {@link writeFile}
   */
  readFile(id: string): Promise<Stream>;
}
