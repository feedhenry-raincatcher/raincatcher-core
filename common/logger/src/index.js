"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Logger_1 = require("./Logger");
var BunyanLogger_1 = require("./BunyanLogger");
exports.BunyanLogger = BunyanLogger_1.BunyanLogger;
var ClientLogger_1 = require("./ClientLogger");
exports.ClientLogger = ClientLogger_1.ClientLogger;
var logger = new Logger_1.EmptyLogger();
/**
 * Set global logger to be used by all RainCatcher modules
 */
function setLogger(userLogger) {
    logger = userLogger;
}
exports.setLogger = setLogger;
/**
 * Get global logger implementation.
 *
 * @see setLogger - to setup your logger first
 */
function getLogger() {
    return logger;
}
exports.getLogger = getLogger;
//# sourceMappingURL=index.js.map