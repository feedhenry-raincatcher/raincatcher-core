export interface User {
  id: string;
  username: string;
  password: string;
  roles: string[];
}

const userSeedData: User[] = [
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
