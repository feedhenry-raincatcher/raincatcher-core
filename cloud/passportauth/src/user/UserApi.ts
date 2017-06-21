import {BaseUser} from './BaseUser';

export interface DataRepository<T extends BaseUser> {
  findUserById(id: string): Promise<T>;
}

export interface UserApi<T extends BaseUser> {
  findUserById(id: string): Promise<T>;
}

export class UserApiService<T extends BaseUser> implements UserApi<T> {
  protected dataSource: DataRepository<T>;

  constructor(protected readonly source: DataRepository<T>) {
    this.dataSource = source;
  }

  public findUserById(id: string) {
    return this.dataSource.findUserById(id);
  }
}
