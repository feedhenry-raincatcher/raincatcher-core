import BaseUser from './BaseUser';
import UserApiService from './UserApi';

export interface UserSec {
  getLogin(id: string): void;
  // getPassword(id: string): string;
  comparePassword(id: string, password: string): void;
  // getRoles(id: string): any;
  getProfileData(id: string): void;
}

class UserSecService<T extends BaseUser> implements UserSec {
  protected userApi: UserApiService<T>;

  constructor(protected readonly userApiService: UserApiService<T>) {
    this.userApi = userApiService;
  }

  public getLogin(id: string) {
    return this.userApi.read(id).then((user) => {
      return user.username;
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

  // public getPassword(id: string)

  // getRoles(id: string)
}

export default UserSecService;
