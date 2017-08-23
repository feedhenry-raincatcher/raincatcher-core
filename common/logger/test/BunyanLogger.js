/// <reference types="mocha" />
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var chai = require("chai");
var BunyanLogger_1 = require("../src/BunyanLogger");
var expect = chai.expect;
var loggerObject = { index: 'index' };
var log = new BunyanLogger_1.BunyanLogger({ name: 'testLogger' });
// call the different end points for logger
describe('Expected results', function () {
    it('should log the expected messages', function () {
        log.debug('Bunyan debug logger message', loggerObject);
        log.error('error logger message', loggerObject);
        log.info('info logger message', loggerObject);
        log.warn('warn logger message', loggerObject);
        log.debug('DEBUG');
        log.info('INFO');
        log.warn('WARN');
        log.error('ERROR');
    });
    it('should log nothing for empty messages', function () {
        log.debug('');
    });
});
//# sourceMappingURL=BunyanLogger.js.map