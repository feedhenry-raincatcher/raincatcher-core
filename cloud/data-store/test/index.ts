/// <reference types="mocha" />
import MongoStore, { Store } from '../src';

import fixtures, { Todo, User } from './fixtures';

export default function(testStoreFactory: () => Store<User>) {
  describe('Store Interface', function() {
    let store: Store<User> = null;

    beforeEach(); {
      store = testStoreFactory();
      store.reset();
    }

    it('should showcase a chainable query interface', function() {
      // Fluent interface example
      return store.query()
        .where('name', 'jon')
        .gt('age', 18)
        // .gt('age', 'foo') => Argument of type '"foo"' is not assignable to parameter of type 'number'.
        .or(store.or().where('name', 'snow'))
        .getSingle().tap(u => console.log(u.age));
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
    let store: MongoStore<User>;
    it('should receive mongoose-specific params on the constructor', function() {
      store = new MongoStore<User>(mongoose.createConnection('mongodb://localhost'));
    });
    it('should allow for supplying a Schema for T');
  });
}

