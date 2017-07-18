import { LoggerManager } from '@raincatcher/logger';
import { UserRepository } from '../user/UserRepository';
import { UserService } from '../user/UserService';

const log = new LoggerManager();

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
    const callback = (err?: Error, user?: any) => {
      if (user && userService.validatePassword(user, password)) {
        return done(null, user);
      }

      return err ? done(err, false) : done(null, false);
    };

    userRepo.getUserByLogin(loginId, callback);
  };
};
