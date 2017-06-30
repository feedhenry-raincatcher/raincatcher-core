import {User} from '../src/index';
import {UserData} from './UserSeedData';

/**
 * A sample user implementation
 */
export class BaseUser implements User {
  constructor(protected readonly user: UserData|undefined) {
  }

  public getLoginId() {
    return this.user ? this.user.username : undefined;
  }

  public getPasswordHash() {
    return this.user ? this.user.password : undefined;
  }

  public getRoles() {
    return this.user ? this.user.roles : [];
  }
}

export default BaseUser;
