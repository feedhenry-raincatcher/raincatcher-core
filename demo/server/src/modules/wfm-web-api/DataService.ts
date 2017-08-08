import { Db } from 'mongodb';

/**
 * Service for performing data operations on mongodb database
 */
export class DataService {

  /**
   * @param db - mongodb driver connection
   * @param collectionName - name of the collection stored in mongodb
   */
  constructor(readonly db: Db, readonly collectionName: string) {
  }

  public list() {
    return this.db.collection(this.collectionName).find({});
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
