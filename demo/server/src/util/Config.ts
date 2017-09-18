import { existsSync } from 'fs';
import { basename, join } from 'path';
/**
 * Interface for fetching application configuration.
 *
 * @type T specifies interface used to wrap configuration
 */
export interface Config<T> {
  /**
   * Returns application configuration object.
   */
  getConfig(): T;
}

/**
 * Default implementation for configuration.
 * Reads configuration from different location depending on process.env.NODE_ENV
 *
 * Required configuration files in application root:
 * - config-dev.js
 * - config-prod.js
 */
export class EnvironmentConfig<T> implements Config<T> {
  private rawConfig: T;

  constructor() {
    this.setupProfile();
  }

  public getConfig() {
    return this.rawConfig;
  }

  private setupProfile() {
    const profile = process.env.CONFIG_PROFILE;
    let location = '../../config-' + profile + '.js';
    if (!existsSync(join(__dirname, location))) {
      console.info('Using default server configuration.'
        + 'Set CONFIG_PROFILE env var to point to different configuration file.');
      location = '../../config-dev.js';
    }
    console.info('Loading server side configuration', { path: basename(location) });
    this.rawConfig = require(location);
  }
}

export interface CloudAppConfig {
  port: number;
  morganOptions: string;
  logStackTraces: boolean;
  // See bunyan.d.ts/LoggerOptions
  bunyanConfig: any;
  seedDemoData: boolean;
  security: {
    adminRole: string,
    userRole: string,
    keycloak: any
    passportjs: {
      jwtSecret: any;
      portalLoginPage: {
        title: string,
        invalidMessage: string
      };
    }
  };
  sync: {
    customDataHandlers: boolean;
    globalOptions: any
  };
  mongodb: {
    url: string,
    options: any
  };
  redis: {
    url: string
  };
}
const appConfig: Config<CloudAppConfig> = new EnvironmentConfig<CloudAppConfig>();

export default appConfig;
