/// <reference types="mocha" />

import MongooseStore, { Store } from './index';

interface User {
  id: string;
  /** User's name */
  name: string;
  age: number;
  todos: Todos[];
  getFullName: () => string;
}

interface Todos {
  id: string;
  what: string;
  deadline: Date;
  userId: string;
  pastDeadline: (when: Date) => boolean;
}

describe('Store Interface', function() {
  const store: Store<User> = null; // = new MongooseStore<User>(mongoose.createConnection('localhost'));

  it('should showcase a chainable query interface', function() {
    // Fluent interface example
    return store.query()
      .where('name', 'jon')
      .gt('age', 18)
      // .gt('age', 'foo') => Argument of type '"foo"' is not assignable to parameter of type 'number'.
      .or(store.or().where('name', 'snow'))
      .getSingle().tap((u) => console.log(u.age));
  });
  it('should showcase a object-based query interface', function() {
    // Mongoose-style large query object example
    return store.find({
      where: {
        eq: {name: 'trever'},
        gt: { age: 18 },
        or: {
          eq: { name: 'snow' }
        }
      }
    });
  });
  it('should allow query filters for sub-models');
  it('should allow for batch creation of sub-models');
  it('should allow for default values');
  it('should be able to define runtime validation');
  it('should emit events before create');
  it('should emit events before update');
  it('should emit events before delete');
  it('should emit events after create');
  it('should emit events after update');
  it('should emit events after delete');
});

describe('MongooseStore', function() {
  let store: MongooseStore<User>;
  it('should receive mongoose-specific params on the constructor', function() {
    store = new MongooseStore<User>(mongoose.createConnection('mongodb://localhost'));
  });
  it('should allow for supplying a Schema for T');
});
