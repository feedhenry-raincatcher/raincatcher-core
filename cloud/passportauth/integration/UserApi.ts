import {BaseUser} from '../src/index';
import {DataRepository} from './UserDataRepository';
import {User} from './UserSeedData';

/**
 * A sample implementation of a base user api
 */
export class UserApi implements BaseUser {
  protected userDataRepo: DataRepository<User>;

  constructor(protected readonly dataRepo: DataRepository<User>) {
    this.userDataRepo = dataRepo;
  }

  public getId(loginId: string) {
    return this.dataRepo.getUserById(loginId).then((user) => {
      return user ? user.id : null;
    });
  }

  public getLoginId(id: string) {
    return this.dataRepo.getUserById(id).then((user) => {
      return user ? user.username : null;
    });
  }

  public getPasswordHash(id: string) {
    return this.dataRepo.getUserById(id).then((user) => {
      return user ? user.password : null;
    });
  }

  public getRoles(id: string) {
    return this.dataRepo.getUserById(id).then((user) => {
      return user ? user.roles : [];
    });
  }
}

export default UserApi;
