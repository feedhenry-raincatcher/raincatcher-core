"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bunyan = require("bunyan");
/**
 * Default logger implementation for server side code using bunyan.
 * For more information about logging methods please refer to bunyan documentation.
 *
 * @see Logger
 */
var BunyanLogger = /** @class */ (function () {
    function BunyanLogger(options) {
        this.logger = bunyan.createLogger(options);
    }
    BunyanLogger.prototype.debug = function (message, options) {
        if (options) {
            this.logger.debug(options, message);
        }
        else {
            this.logger.debug(message);
        }
    };
    BunyanLogger.prototype.error = function (message, options) {
        if (options) {
            this.logger.error(options, message);
        }
        else {
            this.logger.error(message);
        }
    };
    BunyanLogger.prototype.info = function (message, options) {
        if (options) {
            this.logger.info(options, message);
        }
        else {
            this.logger.info(message);
        }
    };
    BunyanLogger.prototype.warn = function (message, options) {
        if (options) {
            this.logger.warn(options, message);
        }
        else {
            this.logger.warn(message);
        }
    };
    return BunyanLogger;
}());
exports.BunyanLogger = BunyanLogger;
//# sourceMappingURL=BunyanLogger.js.map