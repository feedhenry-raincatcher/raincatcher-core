'use strict';

import * as passport from 'passport';
import {Strategy} from 'passport-local';
import * as express from 'express';

interface PassportAuth<T> {
  init(app: express.Express): void
  setStrategy(strategy: Function): void
  setSerializeFunction(serialize: Function): void
  setDeserializeFunction(deserialize: Function): void
  authenticate(strategy: string, opts: Object): void
}

class PassportAuthImpl<T> implements PassportAuth<T> {
  public init(app: express.Express) {
    console.log('>>>>>>>', 'initializing passport auth');
    app.use(passport.initialize());
    app.use(passport.session());
  }

  public setStrategy(strategy: Function) {
    console.log('>>>>>>>', 'setting strategy');
    passport.use(new Strategy((username: string, password: string, done: Function) => {
      strategy(username, password, done);
    }));
  }

  public setSerializeFunction(serialize: Function) {
    //determines which data of the user object should be stored in the session.
    //will be attached to req.session.passport.user
    //Will use this info to deserialize the whole user object later.
    console.log('>>>>>>>', 'setting serialize function');
    passport.serializeUser((user: T, done: Function) => {
      serialize(user, done);
    });
  }

  public setDeserializeFunction(deserialize: Function) {
    //Retrieves user object from the source using the id as an identifier.
    console.log('>>>>>>>', 'setting deserialize function');
    passport.deserializeUser((id: string, done: Function) => {
      deserialize(id, done);
    });
  };

  public authenticate(strategy: string, opts: Object) {
    //check if user is already logged in.

    passport.authenticate(strategy, opts);
  }
}

export default PassportAuthImpl;
