import * as Promise from 'bluebird';
import * as _ from 'lodash';
import {DataRepository} from '../src/index';
import {User} from './UserSeedData';

export class UserDataRepository implements DataRepository<User> {
  protected userData: User[];

  constructor(protected readonly seedData: User[]) {
    this.userData = seedData;
  }

  public findUserById(id: string) {
    // A sample read user function from a data source
    const userObj = _.find(this.userData, function(user: User) {
      if (user.id === id || user.username === id) {
        return user;
      }
    });

    return Promise.resolve(userObj);
  }
}
