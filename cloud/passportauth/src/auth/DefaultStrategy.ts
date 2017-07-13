import { logger } from '@raincatcher/logger';
import { UserSecurityService } from '../user/UserSecurityService';

// const log: Logger = new BunyanLogger({ name: 'Passport-Auth', level: 'error' });

import { User } from '../user/User';

/**
 * Default strategy to be used by Passport's local strategy. If user credentials are valid, proceed to login,
 * otherwise, reject it. Calls serialize user with user login id.
 *
 * @param userSec - security service
 * @returns {Function} - Returns the default strategy function to be used by passport
 */
export const defaultStrategy = (userSec: UserSecurityService) => {
  logger.error('test ', {level: 'Test', tag: 'cloud:passportauth:src:auth', src: 'DefaultStrategy.ts'});
  return (loginId: string, password: string, done: (error: Error | null, user: any) => any) => {
    userSec.getUserByLogin(loginId).then((user: User) => {
      if (!user) {
        return done(null, false);
      } else {
        if (userSec.comparePassword(user, password)) {
          return done(null, user);
        }
        return done(null, false);
      }
    })
      .catch((err: Error) => {
        logger.error('An error occurred when retrieving user: ', err,
          {level: 'ERROR', tag: 'cloud:passportauth:src:auth', src: 'DefaultStrategy.ts'});
        return done(err, null);
      });
  };
};
