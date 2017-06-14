/**
 * Wraps sync data handlers into single object.
 * For more information see FeedHenry sync documentation.
 */
export interface DataSetHandler {
  /**
   * Handle list operation for specific dataset.
   * Method may be used to override default data handler to have control over how sync is retrieving and storing data
   *
   * @param query - database query that needs to be executed
   * @param metadata - additional metadata passed by client
   */
  // tslint:disable-next-line:max-line-length
  onList?: (datasetId: string, query: any, metaData: any, callback: (err: Error | string | undefined, res: any | undefined) => void) => void;

  /**
   * Handle create operation for specific dataset
   * Method may be used to override default data handler to have control over how sync is retrieving and storing data
   *
   * @param query - database query that needs to be executed
   * @param metadata - additional metadata passed by client
   */
  // tslint:disable-next-line:max-line-length
  onCreate?: (datasetId: string, query: any, metaData: any, callback: (err: Error | string | undefined, res: any | undefined) => void) => void;

  /**
   * Handle read operation for specific dataset
   * Method may be used to override default data handler to have control over how sync is retrieving and storing data
   *
   * @param uid object id
   * @param metadata - additional metadata passed by client
   */
  // tslint:disable-next-line:max-line-length
  onRead?: (datasetId: string, uid: any, metaData: any, callback: (err: Error | string | undefined, res: any | undefined) => void) => void;

  /**
   * Handle update operation for specific dataset
   * Method may be used to override default data handler to have control over how sync is retrieving and storing data
   *
   * @param uid object id
   * @param metadata - additional metadata passed by client
   */
  // tslint:disable-next-line:max-line-length
  onUpdate?: (datasetId: string, uid: string, data: any, metaData: any, callback: (err: Error | string | undefined, res: any | undefined) => void) => void;

  /**
   * Handle delete operation for specific dataset
   * Method may be used to override default data handler to have control over how sync is retrieving and storing data
   *
   * @param uid object id
   * @param metadata - additional metadata passed by client
   */
  // tslint:disable-next-line:max-line-length
  onDelete?: (datasetId: string, uid: string, metaData: any, callback: (err: Error | string | undefined, res: any | undefined) => void) => void;
}

export default DataSetHandler;
