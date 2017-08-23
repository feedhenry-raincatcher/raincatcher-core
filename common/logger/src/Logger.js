"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Empty logger implementation used by default to suppress logging
 */
var EmptyLogger = /** @class */ (function () {
    function EmptyLogger() {
    }
    EmptyLogger.prototype.debug = function (message, options) {
        //
    };
    EmptyLogger.prototype.error = function (message, options) {
        //
    };
    EmptyLogger.prototype.info = function (message, options) {
        //
    };
    EmptyLogger.prototype.warn = function (message, options) {
        //
    };
    return EmptyLogger;
}());
exports.EmptyLogger = EmptyLogger;
//# sourceMappingURL=Logger.js.map