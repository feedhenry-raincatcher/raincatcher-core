import * as Promise from 'bluebird';
import * as _ from 'lodash';
import {User} from './UserSeedData';

interface DataSource<T> {
  read(id: string): object;
}

export class UserDataSource<T extends User> implements DataSource<T> {
  protected userData: User[];

  constructor(protected readonly seedData: User[]) {
    this.userData = seedData;
  }

  public read(id: string) {
    // A sample read user function from data source
    const userObj = _.find(this.userData, function(user: User) {
      if (user.id === id || user.username === id) {
        return user;
      }
    });

    return Promise.resolve(userObj);
  }
}
