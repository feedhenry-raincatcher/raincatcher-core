import { Injectable } from '@angular/core';
import { User } from './User';
import { ConfigService } from './config.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UserService {
  constructor(private http: HttpClient, private config: ConfigService) {}
  getUsers() {
    return this.http.get<User[]>(this.config.apiRootUrl + '/users');
  }
}
