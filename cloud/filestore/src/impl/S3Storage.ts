
import { getLogger } from '@raincatcher/logger';
import * as BlueBird from 'bluebird';
import * as mongo from 'mongodb';
import { MongoClient } from 'mongodb';
import * as path from 'path';
import s3 from 's3';
import { FileMetadata } from '../file-api/FileMetadata';
import { FileStorage } from '../file-api/FileStorage';

export interface S3StorageConfiguration {

  /**
   * See s3 documentation
   */
  s3Config: any;

  /**
   * Bucket (folder) to save file
   */
  bucket: string;

  /**
   * Permissions for bucket. For example: authenticated-read
   */
  bucketPermissions: string;
}

/**
 * Implementation that using server filesystem to store files.
 * This storage is not executing any actions as files are already stored in the disc drive.
 */
export class S3Storage implements FileStorage {
  private awsClient: any;
  private storageConfig: S3StorageConfiguration;
  /**
   * @param storageConfig configuration that should be passed from client
   *
   * Example:
   *   {
   *    s3Options: {
   *       accessKeyId: process.env.AWS_S3_ACCESS_KEY,
   *       secretAccessKey: process.env.AWS_S3_ACCESS_KEY_SECRET,
   *       region: process.env.AWS_S3_REGION
   *     },
   *     bucket: "raincatcher-files"
   *   }
   */
  constructor(storageConfig: S3StorageConfiguration) {
    this.validateConfig(storageConfig);
    this.awsClient = s3.createClient(storageConfig.s3Config);
    this.storageConfig = storageConfig;
  }

  public writeFile(metadata: FileMetadata, fileLocation: string): Promise<any> {
    const file = metadata.id;
    const params = {
      localFile: fileLocation,
      ACL: this.storageConfig.bucketPermissions,
      s3Params: {
        Bucket: this.storageConfig,
        Key: file
      }
    };
    const uploader = this.awsClient.uploadFile(params);
    return new BlueBird(function(resolve, reject) {
      uploader.on('error', function(err) {
        getLogger().error('An error occurred when reading file from s3', err);
        reject(err.stack);
      });
      uploader.on('end', function() {
        resolve(metadata.id);
      });
    });
  }

  public readFile(fileName: string): Promise<any> {
    const file = fileName;
    const paramsStream = {
      Bucket: this.storageConfig.bucket,
      Key: file
    };
    const self = this;
    return new BlueBird(function(resolve, reject) {
      try {
        const stream = self.awsClient.downloadStream(paramsStream);
        resolve(stream);
      } catch (error) {
        getLogger().error('An error occurred when streaming file from s3', error);
        reject(error);
      }
    });

  }

  /**
   * Validates whether the supplied S3 configuration has the required keys
   * @param config S3 storage configuration object
   */
  private validateConfig(config: S3StorageConfiguration) {
    if (!config.bucket) {
      throw Error('Invalid configuration for s3 storage: Please specify bucket name');
    }
    if (!config.s3Config) {
      throw Error('Invalid configuration for s3 storage');
    }
    if (!config.s3Config.accessKeyId) {
      throw Error('Invalid configuration for s3 storage: Access Key missing');
    }
    if (!config.s3Config.secretAccessKey) {
      throw Error('Invalid configuration for s3 storage: secretAccessKeymissing');
    }
    if (!config.s3Config.region) {
      throw Error('Invalid configuration for s3 storage: region missing');
    }
    return true;
  }
}
