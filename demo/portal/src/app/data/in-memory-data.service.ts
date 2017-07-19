import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { users } from './fixtures/users';

@Injectable()
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    return { users };
  }

  constructor() { }

}
