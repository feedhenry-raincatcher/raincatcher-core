/**
 * Sample user data interface
 */
export interface UserData {
  id: string;
  username: string;
  password: string;
  roles: string[];
}

/**
 * Sample user data
 */
const userSeedData: UserData[] = [
  {
    id: '001',
    username: 'test-admin',
    password: '123',
    roles: ['admin', 'user']
  },
  {
    id: '002',
    username: 'test-user',
    password: '123',
    roles: ['user']
  }
];

export default userSeedData;
