"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Our main implementation
 *
 * Must be the default export
 */
var RaincatcherBase = (function () {
    /**
     * Module's constructor should receive all dependencies as parameters,
     * could also expose an options interface
     * @param logger example of an external dependency
     * @param options example of options/dependencies that are passed via an options object
     */
    function RaincatcherBase(logger, options) {
        this.logger = logger;
        if (options) {
            this.prefix = options.prefix;
        }
    }
    /** Implementation of interface method */
    RaincatcherBase.prototype.foo = function (msg) {
        return this.logger.log(this.prefix + msg);
    };
    /** Sample extra function outside of public interface */
    RaincatcherBase.prototype.customFunction = function () {
        return this.prefix + " Hello World";
    };
    /** Sample extra non-tested function */
    RaincatcherBase.prototype.notTested = function () {
        return 'Boo';
    };
    return RaincatcherBase;
}());
exports.default = RaincatcherBase;
//# sourceMappingURL=index.js.map