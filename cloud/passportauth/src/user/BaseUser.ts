export interface BaseUser {
  getId(loginId: string): Promise<string>;
  getLoginId(id: string): Promise<string>;
  getPasswordHash(id: string): Promise<string>;
  getRoles(id: string): Promise<string[]>;
}

export default BaseUser;
