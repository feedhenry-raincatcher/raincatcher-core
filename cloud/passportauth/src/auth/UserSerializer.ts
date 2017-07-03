
/**
 * Default serialize user function to be used by Passport. Stores the user's loginId to the session
 *
 * @param user {string} - A unique login Id to be stored in the session
 * @param done {Function}
 */
export const DefaultSerializeUser = (user: string, done: (error: Error|null, user: string) => any) => {
    return done(null, user);
};

/**
 * Default deserialize user function to be used by Passport. Attaches the user login Id to
 * req.user
 *
 * @returns {Function} - Returns the default deserialize user function
 */
export const DefaultDeserializeUser = () => {
    return (user: string, done: (error: Error|null, user: string) => any) => {
        return done(null, user);
    };
};
