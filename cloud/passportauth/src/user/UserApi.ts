import {BaseUser} from './BaseUser';

export interface DataRepository<T extends BaseUser> {
  findUserById(id: string): Promise<T>;
}

export interface UserApi<T extends BaseUser> {
  findUserById(id: string): Promise<T>;
}

export class UserApiService<T extends BaseUser> implements UserApi<T> {
  protected dataRepo: DataRepository<T>;

  constructor(protected readonly repo: DataRepository<T>) {
    this.dataRepo = repo;
  }

  public findUserById(id: string) {
    return this.dataRepo.findUserById(id);
  }
}
