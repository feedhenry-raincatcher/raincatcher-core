

// Server side application configuration
var config = {
  // Application port number
  "port": process.env.PORT || process.env.FH_PORT || 8001,
  "morganFormat": null,
  "logStackTraces": false,
  // Use this parameter to disable inserting demo data into mongodb
  "seedDemoData": false,
  // General security configuration
  "security": {
    "adminRole": "admin",
    "userRole": "user",
    // Passport.js security configuration
    "passportjs": {
      // Passport.js secret for JWT tokens used in mobile. Change this value even for development
      // To generate strong secret: node -e "console.log(require('crypto').randomBytes(64).toString('hex'));"
      "jwtSecret": "D837131FD17F62CB85FBD5919563086369691F4D42379C3596F811839A8992CBA1FBA88DF243BF2481940F112D339C33283BDFEF29A13612550EDAAAB7B5E061",
      // Allows to provide custom login page messages
      "portalLoginPage": {
        "title": "RainCatcher Portal",
        "invalidMessage": "Invalid Credentials"
      },
    },
    /// Redis session store configuration
    // https://github.com/tj/connect-redis
    "redisStore": {
      "url": getRedisUrl(),
      "prefix": "rc-session:",
      "logErrors": true
    },
    // Configuration for express session (used for both passport and keycloak)
    // https://github.com/expressjs/session
    "session": {
      // Generate new secret for production use
      "secret": process.env.SESSION_SECRET || '90d12c73a1808f65029f41e1b87abf47be4b226b061dd2c025eae3f981ef243ddd',
      "resave": false,
      "saveUninitialized": true,
      "cookie": {
        "secure": false,
        "httpOnly": true,
        "path": '/'
      }
    },
    // Keycloak configuration. Fill in details to enable keycloak
    "keycloak": {
      "realm": "",
      "bearer-only": true,
      "auth-server-url": "",
      "ssl-required": "external",
      "resource": "",
      "use-resource-role-mappings": true
    }
  },
  "sync": {
    // Required to handle UI.
    "customDataHandlers": true
  },
  // See bunyan.d.ts/LoggerOptions
  "bunyanConfig": {
    "name": "Demo application",
    "level": "debug"
  },
  // Database configuration
  "mongodb": {
    "url": getMongoUrl(),
    "options": {}
  },
  // Cache layer configuration
  "redis": {
    "url": getRedisUrl()
  },
}

function getMongoUrl() {
  if (process.env.MONGO_CONNECTION_URL) return process.env.MONGO_CONNECTION_URL
  // Legacy env variable only to support in house systems
  if (process.env.FH_MONGODB_CONN_URL) return process.env.FH_MONGODB_CONN_URL;
  return "mongodb://127.0.0.1:27017/raincatcher";
}

function getRedisPort() {
  if (process.env.REDIS_PORT) return process.env.REDIS_PORT
  if (process.env.FH_REDIS_PORT) return process.env.FH_REDIS_PORT
  return "127.0.0.1";
}
function getRedisHost() {
  if (process.env.REDIS_HOST) return process.env.REDIS_HOST
  if (process.env.FH_REDIS_HOST) return process.env.FH_REDIS_HOST
  return 6379;
}

function getRedisUrl() {
  return 'redis://' + getRedisHost() + ':' + getRedisPort()
}

module.exports = config;
