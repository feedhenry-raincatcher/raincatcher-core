import * as Promise from 'bluebird';
import {BaseUser} from '../src/index';
import UserDataRepository from './UserDataRepository';
import {User} from './UserSeedData';

/**
 * A sample implementation of a base user api
 */
export class UserApi implements BaseUser {
  protected userDataRepo: UserDataRepository;
  protected user: User|undefined;

  constructor(protected readonly dataRepo: UserDataRepository) {
    this.userDataRepo = dataRepo;
  }

  public getId(loginId: string) {
    return this.dataRepo.getUserById(loginId).then((user) => {
      this.user = user;
      return this.user ? this.user.id : null;
    });
  }

  public getLoginId() {
    return this.user ? Promise.resolve(this.user.username) : Promise.resolve(null);
  }

  public getPasswordHash() {
    return this.user ? Promise.resolve(this.user.password) : Promise.resolve(null);
  }

  public getRoles() {
    return this.user ? Promise.resolve(this.user.roles) : Promise.resolve(null);
  }
}

export default UserApi;
