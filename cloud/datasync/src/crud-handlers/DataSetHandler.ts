
type StandardCb<T> = (err: Error | string | null, res: T | null) => void;

interface DataSetHandler {
    handleList?(dataset_id: string, onList: (dataset_id: string, params: any, meta_data: any, callback: StandardCb<any>) => void): void;

    handleCreate?(dataset_id: string, onCreate: (dataset_id: string, data: any, meta_data: any, callback: StandardCb<any>) => void): void;

    handleRead?(dataset_id: string, onRead: (dataset_id: string, uid: any, meta_data: any, callback: StandardCb<any>) => void): void;

    handleUpdate?(dataset_id: string, onUpdate: (dataset_id: string, uid: string, data: any, meta_data: any, callback: StandardCb<any>) => void): void;

    handleDelete?(dataset_id: string, onCreate: (dataset_id: string, uid: string, meta_data: any, callback: StandardCb<any>) => void): void;
}

export default DataSetHandler;