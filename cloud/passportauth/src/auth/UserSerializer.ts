import { User } from '../user/User';

/**
 * Default serialize user function to be used by Passport. Stores the user to the session
 *
 * @param user {string} - A unique login Id to be stored in the session
 * @param done {Function}
 */
export const DefaultSerializeUser = (user: User, done: (error: Error | null, user: any) => any) => {
  return done(null, user.getLoginId());
};

/**
 * Default deserialize user function to be used by Passport. Attaches the user to
 * req.user
 *
 * @returns {Function} - Returns the default deserialize user function
 */
export const DefaultDeserializeUser = () => {
  return (userId: string, done: (error: Error | null, user: any) => any) => {
    return done(null, userId);
  };
};
