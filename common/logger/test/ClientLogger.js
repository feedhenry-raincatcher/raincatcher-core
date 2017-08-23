/// <reference types="mocha" />
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var ClientLogger_1 = require("../src/ClientLogger");
var loggerObject = { test: 'test' };
var emptyObject = {};
// call the different end points for logger
describe('Expected results', function () {
    it('should log the expected messages', function () {
        var log = new ClientLogger_1.ClientLogger(0 /* TRACE */);
        log.debug('debug ConsoleLogger message', loggerObject);
        log.error('error ConsoleLogger message', loggerObject);
        log.info('info ConsoleLogger message', loggerObject);
        log.warn('warn ConsoleLogger message', loggerObject);
        log.debug('debug ConsoleLogger message');
        log.error('error ConsoleLogger message');
        log.info('info ConsoleLogger message');
        log.warn('warn ConsoleLogger message');
    });
});
//# sourceMappingURL=ClientLogger.js.map