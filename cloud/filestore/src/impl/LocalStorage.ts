import { getLogger } from '@raincatcher/logger';
import * as BlueBird from 'bluebird';
import { FileMetadata } from '../file-api/FileMetadata';
import { FileStorage } from '../file-api/FileStorage';

/**
 * Implementation that using server filesystem to store files.
 * This storage is not executing any actions as files are already stored in the disc drive.
 */
export class LocalStorage implements FileStorage {

  public writeFile(metadata: FileMetadata, fileLocation: string): Promise<any> {
    return BlueBird.resolve(fileLocation);
  }

  public streamFile(namespace: string, fileName: string): Promise<any> {
    return BlueBird.resolve();
  }
}
