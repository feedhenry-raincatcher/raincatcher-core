

/**
 * Wraps sync data handlers into single object.
 * For more information see FeedHenry sync documentation.
 */
export interface DataSetHandler {
  /**
    * Handle list operation for specific dataset.
    * Method may be used to override default data handler to have control over how sync is retrieving and storing data
    */
  onList?: (datasetId: string, params: any, metaData: any, callback: (err: Error | string | undefined, res: any | undefined) => void) => void;

  /**
   * Handle create operation for specific dataset
   * Method may be used to override default data handler to have control over how sync is retrieving and storing data
   */
  onCreate?: (datasetId: string, data: any, metaData: any, callback: (err: Error | string | undefined, res: any | undefined) => void) => void;

  /**
  * Handle read operation for specific dataset
  * Method may be used to override default data handler to have control over how sync is retrieving and storing data
  */
  onRead?: (datasetId: string, uid: any, metaData: any, callback: (err: Error | string | undefined, res: any | undefined) => void) => void

  /**
   * Handle update operation for specific dataset
   * Method may be used to override default data handler to have control over how sync is retrieving and storing data
   */
  onUpdate?: (datasetId: string, uid: string, data: any, metaData: any, callback: (err: Error | string | undefined, res: any | undefined) => void) => void;

  /**
   * Handle delete operation for specific dataset
   * Method may be used to override default data handler to have control over how sync is retrieving and storing data
   */
  onDelete?: (datasetId: string, uid: string, metaData: any, callback: (err: Error | string | undefined, res: any | undefined) => void) => void;
}

export default DataSetHandler;
