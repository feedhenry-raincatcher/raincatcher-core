
type StandardCb<T> = (err: Error | string | null, res: T | null) => void;

interface GlobalHandler {
  globalHandleList(onList: (dataset_id: string, params: any, meta_data: any, callback: StandardCb<any>) => void): void;

  globalHandleCreate(onCreate: (dataset_id: string, params: any, meta_data: any, callback: StandardCb<any>) => void): void;

  globalHandleRead(onRead: (dataset_id: string, uid: string, meta_data: any, callback: StandardCb<any>) => void): void;

  globalHandleUpdate(onCreate: (dataset_id: string, uid: string, data: any, meta_data: any, callback: StandardCb<any>) => void): void;

  globalHandleDelete(onCreate: (dataset_id: string, uid: string, meta_data: any, callback: StandardCb<any>) => void): void;
}


