import { Db } from 'mongodb';

/**
 * Service for performing data operations on mongodb database
 */
export class DataService {

  private db: Db;

  /**
   * @param dbPromise - mongodb driver connection promise
   * @param collectionName - name of the collection stored in mongodb
   */
  constructor(dbPromise: Promise<any>, readonly collectionName: string) {
    const self = this;
    dbPromise.then(function(data: any) {
      self.db = data.mongo;
    });
  }

  public list() {
    console.info('logging', this.collectionName);
    return this.db.collection(this.collectionName).find({}).toArray();
  }

  public get(id: string) {
    return this.db.collection(this.collectionName).findOne({ id });
  }

  public create(object: any) {
    return this.db.collection(this.collectionName).insertOne(object);
  }

  public update(object: any) {
    const id = object.id;
    return this.db.collection(this.collectionName).updateOne({ id }, object);
  }

  public delete(id: string) {
    return this.db.collection(this.collectionName).deleteOne({ id });
  }
}
