import { getLogger } from '@raincatcher/logger';
import * as BlueBird from 'bluebird';
import { createReadStream } from 'fs';
import { FileMetadata } from '../file-api/FileMetadata';
import { FileStorage } from '../file-api/FileStorage';
import { buildFilePath, FILE_STORAGE_DIRECTORY } from '../services/FileService';

/**
 * Implementation that uses the server filesystem to store files.
 * This storage implementation does not execute any extra actions as files are already stored in the local filesystem
 */
export class LocalStorage implements FileStorage {

  public writeFile(metadata: FileMetadata, fileLocation: string) {
    return BlueBird.resolve(metadata.id);
  }

  public readFile(id: string) {
    const fileLocation = buildFilePath(id);
    return BlueBird.resolve(createReadStream(fileLocation));
  }
}
