/**
 * @module @raincatcher/filestore
 */

import * as Promise from 'bluebird';
import { Stream } from 'stream';
import { FileMetadata } from './FileMetadata';

/**
 * Interface used to retrieve file from the storage.
 * Implementors can relay on the interface to store or retrieve files stream.
 */
export interface FileStorage {

  /**
   * Write file that is saved in temporary local storage to the implementation's underlying storage.
   *
   * @param metadata for the file to be saved
   * @param fileLocation full path to filesystem location
   *
   * @return Promise of the file's id
   */
  writeFile(metadata: FileMetadata, fileLocation: string): Promise<string>;

  /**
   * Retrieve file stream from storage
   *
   * @param id Unique identifier that should match the metadata passed
   * in {@link writeFile} when the file was added to storage
   *
   * @return Promise of a readable stream containing the file data
   */
  readFile(id: string): Promise<Stream>;
}
