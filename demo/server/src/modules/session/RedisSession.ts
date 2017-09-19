
import * as connectRedis from 'connect-redis';
import * as session from 'express-session';
import appConfig from '../../util/Config';
const config = appConfig.getConfig();

const RedisStore = connectRedis(session);
config.security.session.store = new RedisStore(config.security.redisStore);

export default config.security.session;
