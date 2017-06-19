import {BaseUser} from './BaseUser';
import {UserApiService} from './UserApi';

export interface UserSec<T extends BaseUser> {
  getUserId(username: string): Promise<string>;
  comparePassword(id: string, password: string): Promise<boolean>;
  getProfileData(id: string): Promise<T>;
  // getRoles(id: string): any;
}

export class UserSecService<T extends BaseUser> implements UserSec<T> {
  protected userApi: UserApiService<T>;

  constructor(protected readonly userApiService: UserApiService<T>) {
    this.userApi = userApiService;
  }

  public getUserId(username: string) {
    return this.userApi.read(username).then((user) => {
      let id = null;
      if (user) {
        id = user.id;
      }
      return id;
    });
  }

  public comparePassword(id: string, password: string) {
    return this.userApi.read(id).then((user) => {
      return (user.password === password); // replace with bcrypt compare
    });
  }

  public getProfileData(id: string) {
    return this.userApi.read(id).then((user) => {
      return user;
    });
  }

  // getRoles(id: string)
}
