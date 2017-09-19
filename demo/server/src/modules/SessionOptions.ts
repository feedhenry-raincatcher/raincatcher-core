import * as connectRedis from 'connect-redis';
import * as session from 'express-session';

const RedisStore = connectRedis(session);
const store = new RedisStore({
  host: 'localhost',
  port: 6379,
  prefix: 'rc-session:',
  logErrors: true
});

const sessionOpts = {
  store
};

export default sessionOpts;
