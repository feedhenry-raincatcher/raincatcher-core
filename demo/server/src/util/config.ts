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
};

/**
 * Default implementation for configuration. 
 * Reads configuration from different location depending on process.env.NODE_ENV
 * 
 * Required csonfiguration files in application root:
 * - config-dev.json
 * - config-prod.json
 */
export default class EnvironmentConfig<T> implements Config<T> {
    devEnv: boolean;
    rawConfig: T;

    constructor() {
        this.devEnv = process.env.NODE_ENV === 'development';
        if (this.devEnv) {
            this.rawConfig = require("../../config-dev.json");
        } else {
            this.rawConfig = require("../../config-prod.json");
        }
    }

    getConfig() {
        return this.rawConfig;
    }
}

/** Cloud application configuration */
export interface CloudAppConfig {
    morganOptions: string,
    logStackTraces: boolean
}