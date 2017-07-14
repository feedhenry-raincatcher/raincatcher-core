import { BunyanLogger, Logger } from '@raincatcher/logger';
import { UserRepository } from '../user/UserRepository';
import { UserService } from '../user/UserService';

const log: Logger = new BunyanLogger({ name: 'Passport-Auth', level: 'error' });

/**
 * Default strategy to be used by Passport's local strategy. If user credentials are valid, proceed to login,
 * otherwise, reject it.
 *
 * @param userRepo - User repository
 * @param userService - User service
 * @returns {Function} - Returns the default strategy function to be used by passport
 */
export const defaultStrategy = (userRepo: UserRepository, userService: UserService) => {
  return (loginId: string, password: string, done: (error: Error | null, user: any) => any) => {
    userRepo.getUserByLogin(loginId).then((user: any) => {
      if (user && userService.getPassword(user) === password) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    })
    .catch((err: Error) => {
      log.error('An error occurred when retrieving user: ', err);
      return done(err, null);
    });
  };
};
