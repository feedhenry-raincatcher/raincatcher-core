

// Server side application configuration
var config = {
  // Application port number
  "port": process.env.PORT || process.env.FH_PORT || 8001,
  "morganOptions": null,
  "logStackTraces": false,
  // Use this parameter to disable inserting demo data into mongodb
  "seedDemoData": false,
  // General security configuration
  "security": {
    "adminRole": "admin",
    "userRole": "user",
    "allowedRoles": ["adminRole"],
    // Passport.js security configuration
    "passportjs": {
      // Passport.js secret for JWT tokens. Provide custom value even for development needs
      "jwtSecret": "D837131FD17F62CB85FBD5919563086369691F4D42379C3596F811839A8992CBA1FBA88DF243BF2481940F112D339C33283BDFEF29A13612550EDAAAB7B5E061",
      // Allows to provide custom login page messages
      "portalLoginPage": {
        "title": "RainCatcher Portal",
        "invalidMessage": "Invalid Credentials",
        "insufficientPrivilegesMessage": "Insufficient Privileges"
      },
    },
    // Keycloak configuration. Uncomment to enable keycloak integration
    // "keycloak": {
    //   "realm": "",
    //   "bearer-only": true,
    //   "auth-server-url": "",
    //   "ssl-required": "",
    //   "resource": "",
    //   "use-resource-role-mappings": true
    // }
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
  if (process.env.MONGO_CONNECTION_URL) {
    return process.env.MONGO_CONNECTION_URL
  }
  if (process.env.FH_MONGODB_CONN_URL) {
    // Legacy env variable only to support in house systems
    return process.env.FH_MONGODB_CONN_URL;
  }
  return "mongodb://127.0.0.1:27017/raincatcher";
}

function getRedisUrl() {
  if (process.env.REDIS_CONNECTION_URL) {
    return process.env.REDIS_CONNECTION_URL
  }
  // Legacy env variable only to support in house systems
  if (process.env.FH_REDIS_HOST) {
    return 'redis://' + process.env.FH_REDIS_HOST + ':' + process.env.FH_REDIS_PORT
  }
  return "redis://127.0.0.1:6379";
}

module.exports = config;
