import { Injectable } from '@angular/core';
import { User } from './User';
import { ConfigService } from './config.service';
import { HttpClient } from '@angular/common/http';

import { users } from './data/fixtures/users'
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UserService {
  constructor(private http: HttpClient, private config: ConfigService) {}
  getAll() {
    return new Observable<User[]>(subscriber => {
      subscriber.next(users);
      subscriber.complete();
    });
  }
  getById(id: string) {
    return new Observable<User>(subscriber => {
      subscriber.next(users.find(u => u.id === id));
      subscriber.complete();
    });
  }
}
