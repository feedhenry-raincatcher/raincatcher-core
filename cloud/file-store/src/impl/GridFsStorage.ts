import { FileStorage } from '../file-api/FileStorage';


export class GridFsStorage implements FileStorage {
  writeFile(metadata: FileMetadata, fileLocation: string): Promise<any> {
    throw new Error("Method not implemented.");
  }
  streamFile(namespace: string, fileName: string): Promise<any> {
    throw new Error("Method not implemented.");
  }

}

