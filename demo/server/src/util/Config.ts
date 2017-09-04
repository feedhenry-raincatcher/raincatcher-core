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
 * Required csonfiguration files in application root:
 * - config-dev.json
 * - config-prod.json
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
    let location = '../../config-' + profile + '.json';
    if (!existsSync(join(__dirname, location))) {
      console.info('Using default server configuration.'
        + 'Set CONFIG_PROFILE env var to point to different configuration file.');
      location = '../../config-dev.json';
    }
    console.info('Loading server side configuration', { path: basename(location) });
    this.rawConfig = require(location);
  }
}

export interface CloudAppConfig {
  morganOptions: string;
  logStackTraces: boolean;
  // See bunyan.d.ts/LoggerOptions
  bunyanConfig: any;
  keycloakConfig: any;
  seedDemoData: boolean;
  security: {
    adminRole: string,
    userRole: string
  };
  sync: {
    customDataHandlers: boolean;
  };
  mongodb: {
    url: string
    options: any
  };
  redis: {
    url: string
  };
  jwtSecret: string;
  clientUrl: {
    portal: string
  };
}
const appConfig: Config<CloudAppConfig> = new EnvironmentConfig<CloudAppConfig>();

export default appConfig;
