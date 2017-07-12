import { BunyanLogger, Logger } from '@raincatcher/logger';
import { UserRepository } from '../user/UserRepository';

const log: Logger = new BunyanLogger({ name: 'Passport-Auth', level: 'error' });
import { User } from '../user/User';

/**
 * Default strategy to be used by Passport's local strategy. If user credentials are valid, proceed to login,
 * otherwise, reject it.
 *
 * @param UserRepo - user repository
 * @returns {Function} - Returns the default strategy function to be used by passport
 */
export const defaultStrategy = (userRepo: UserRepository) => {
  return (loginId: string, password: string, done: (error: Error | null, user: any) => any) => {
    userRepo.getUserByLogin(loginId).then((user: User) => {
      if (!user) {
        return done(null, false);
      } else {
        return (user.getPasswordHash() === password) ? done(null, user) : done(null, false);
      }
    })
      .catch((err: Error) => {
        log.error('An error occurred when retrieving user: ', err);
        return done(err, null);
      });
  };
};
