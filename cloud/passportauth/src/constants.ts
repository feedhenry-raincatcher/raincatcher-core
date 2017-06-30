import {BunyanLogger, Logger} from '@raincatcher/logger';
import {UserSec} from './user/UserSec';

const log: Logger = new BunyanLogger({name: 'Passport-Auth', level: 'error'});

/**
 * Default strategy to be used by Passport's local strategy. If user credentials are valid, proceed to login,
 * otherwise, reject it. Calls serialize user with user login id.
 *
 * @param userSec {UserSec}
 * @returns {Function} - Returns the default strategy function to be used by passport
 */
export const DEFAULT_STRATEGY = (userSec: UserSec) => {
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

/**
 * Default serialize user function to be used by Passport. Stores the user's loginId to the session
 *
 * @param user {string} - A unique login Id to be stored in the session
 * @param done {Function}
 * @returns {any}
 */
export const DEFAULT_SERIALIZE_USER = (user: string, done: (error: Error|null, user: string) => any) => {
    return done(null, user);
};

/**
 * Default deserialize user function to be used by Passport. Attaches the user login Id to
 * req.user
 *
 * @param userSec {UserSec}
 * @returns {Function} - Returns the default deserialize user function
 */
export const DEFAULT_DESERIALIZE_USER = (userSec: UserSec) => {
    return (user: string, done: (error: Error|null, user: string) => any) => {
        return done(null, user);
    };
};
