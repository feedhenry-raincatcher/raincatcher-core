
import { UserRepository } from '../user/UserRepository';
import { UserService } from '../user/UserService';

/**
 * Default strategy to be used by Passport's local strategy. If user credentials are valid, proceed to login,
 * otherwise, reject it.
 *
 * @param userRepo - User repository
 * @param userService - User service
 * @returns {Function} - Returns the default strategy function to be used by passport
 */
export const webStrategy = (userRepo: UserRepository, userService: UserService) => {
  return (loginId: string, password: string, done: (error: Error | null, user: any) => any) => {
    const callback = (err?: Error, user?: any) => {
      if (user && userService.validatePassword(user, password)) {
        return done(null, user);
      }

      return err ? done(err, false) : done(null, false);
    };

    userRepo.getUserByLogin(loginId, callback);
  };
};

/**
 * Default strategy to be used by Passport's JWT strategy. This will verify and authenticate
 * requests that are trying to access a resource.
 *
 * @param userRepo - User repository
 */
export const jwtStrategy = (userRepo: UserRepository) => {
  return (jwtPayload, done) => {
    const callback = (err?: Error, user?: any) => {
      if (err) {
        return done(err, false);
      } else if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    };
    userRepo.getUserByLogin(jwtPayload, callback);
  };
};
