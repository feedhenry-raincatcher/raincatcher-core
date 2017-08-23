'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var Logger_1 = require("../src/Logger");
var loggerObject = { test: 'test' };
var emptyObject = {};
var log = new Logger_1.EmptyLogger();
// call the different end points for logger
describe('Expected results', function () {
    it('should log nothing', function () {
        log.debug('debug logger message', loggerObject);
        log.error('error logger message', loggerObject);
        log.info('info logger message', loggerObject);
        log.warn('warn logger message', loggerObject);
    });
    it('should log nothing for empty messages', function () {
        log.debug('', emptyObject);
    });
});
//# sourceMappingURL=Logger.js.map