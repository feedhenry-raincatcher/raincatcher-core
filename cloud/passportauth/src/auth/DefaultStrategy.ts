import {BunyanLogger, Logger} from '@raincatcher/logger';
import {UserSecurityService} from '../user/UserSecurityService';

const log: Logger = new BunyanLogger({name: 'Passport-Auth', level: 'error'});

/**
 * Default strategy to be used by Passport's local strategy. If user credentials are valid, proceed to login,
 * otherwise, reject it. Calls serialize user with user login id.
 *
 * @param userSec {UserSec}
 * @returns {Function} - Returns the default strategy function to be used by passport
 */
export const DefaultLocalStrategy = (userSec: UserSecurityService) => {
    return (loginId: string, password: string, done: (error: Error|null, user: any) => any) => {
        userSec.getUserByLogin(loginId).then((user: any) => {
            if (!user) {
                return done(null, false);
            } else {
                return userSec.comparePassword(password) ? done(null, loginId) : done(null, false);
            }
        })
        .catch((err: Error) => {
            log.error('An error occurred when retrieving user: ', err);
            return done(err, null);
        });
    };
};
