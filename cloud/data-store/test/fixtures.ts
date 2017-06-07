type ID = string | number;
/**
 * Sample data interface for tests
 */
export interface User {
  id: ID;
  name: string;
  age: number;
  todos?: Todo[];
}

/**
 * Sample related entity
 */
export interface Todo {
  id: ID;
  what: string;
  deadline: Date;
  userId: ID;
}

const fixtures: { users: User[], todos: Todo[] } = {
  users: [
    {
      id: 1,
      name: 'John',
      age: 40
    }
  ],
  todos: [
    {
      id: 1,
      what: 'Kick behinds',
      deadline: new Date(2100, 1, 1),
      userId: 1
    },
    {
      id: 2,
      what: 'Chew bubblegum',
      deadline: new Date(2100, 1, 1),
      userId: 1
    }
  ]
};

export default fixtures;
