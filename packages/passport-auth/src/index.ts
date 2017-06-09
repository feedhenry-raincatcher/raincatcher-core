'use strict';

//Imports
import * as express from 'express';
import * as passport from 'passport';
import {Strategy} from 'passport-local';

/*
 * Interface for passport authentication
 */

interface PassportAuth {
  //Initialize passport authentication
  init()

  //Authenticate user
  authenticate(strategy: string, opts: Object)

  //Check if user is already logged in otherwise redirect to login page
  loginRequired(req: express.Request, res: express.Response)

  //Returns the roles assigned to the authenticated user
  getUserRoles()

  //Returns a boolean whether the user has a particular role.
  checkHasRole(role: string)

  //Returns the user's profile
  getUserProfile()

  //Log out the authenticated user //?
  logout()
}

class PassportAuthImpl implements PassportAuth {

  init() {
    //passport.serializeUser
    passport.serializeUser(serializeFunc);
    //passport.deserializeUser //require db access
    passport.deserializeUser(deserializeFunc);
    //define strategy //will use bcrypt to compare pass //make configurable //need db access
    passport.use(new Strategy (function(username, password, done) {
      //check db if user exists
        //no user => return done(null, false)
        //invalid password => return done(null, false)
        //right credentials => return done(null, user)
      //Catch for any errors => return (done(err)
    }))
  }

  authenticate(strategy: string, opts: Object) {
    passport.authenticate(strategy, opts); //does this check if the user is already logged in?
  }

  loginRequired(req: express.Request, res: express.Response) {
    //if(!req.user) res.redirect(loginRoute);
    //return next();
  }

  getUserRoles() {
   //return req.user.roles;
  }

  checkHasRole(role: string) {
    //user profile in req.user
    //return boolean
  }

  getUserProfile() {
    //user profile in req.user
    //return req.user
  }

  logout() {
    //req.logout
  }
}


export default PassportAuthImpl;
