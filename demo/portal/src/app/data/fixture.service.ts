import { Observable } from 'rxjs/Observable';

export class FixtureService<T extends {id: string}> {
  protected data: T[];
  protected delayMs: 1500;
  getAll() {
    return new Observable<T[]>(subscriber => {
      setTimeout(() => {
        subscriber.next(this.data);
        subscriber.complete();
      }, this.delayMs);
    });
  }
  getById(id: string) {
    return new Observable<T>(subscriber => {
      setTimeout(() => {
        subscriber.next(this.data.find(p => p.id === id));
        subscriber.complete();
      });
    });
  }
}
