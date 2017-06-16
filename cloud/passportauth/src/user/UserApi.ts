import {BaseUser} from './BaseUser';

export interface UserSource<T extends BaseUser> {
  read(id: string): Promise<T>;
}

export interface UserApi<T extends BaseUser> {
  read(id: string): Promise<T>;
}

class UserApiService<T extends BaseUser> implements UserApi<T> {
  protected dataSource: UserSource<T>;

  constructor(protected readonly source: UserSource<T>) {
    this.dataSource = source;
  }
  public read(id: string) {
    return this.dataSource.read(id);
  }
}

export default UserApiService;

