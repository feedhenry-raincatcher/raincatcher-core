"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logger = require("loglevel");
/**
 * Default client (browser) logger implementation using loglevel library
 *
 * @see Logger
 */
var ClientLogger = /** @class */ (function () {
    function ClientLogger(level) {
        if (level === void 0) { level = 3 /* WARN */; }
        logger.setLevel(level);
    }
    ClientLogger.prototype.debug = function (message, options) {
        if (options) {
            logger.info(message, options);
        }
        else {
            logger.info(message);
        }
    };
    ClientLogger.prototype.error = function (message, options) {
        if (options) {
            logger.error(message, options);
        }
        else {
            logger.error(message);
        }
    };
    ClientLogger.prototype.info = function (message, options) {
        if (options) {
            logger.info(message, options);
        }
        else {
            logger.info(message);
        }
    };
    ClientLogger.prototype.warn = function (message, options) {
        if (options) {
            logger.warn(message, options);
        }
        else {
            logger.warn(message);
        }
    };
    return ClientLogger;
}());
exports.ClientLogger = ClientLogger;
//# sourceMappingURL=ClientLogger.js.map