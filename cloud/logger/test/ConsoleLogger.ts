/// <reference types="mocha" />
'use strict';

import {ConsoleLogger} from '../src/ConsoleLogger';
const loggerObject: object = {test: 'test'};
const emptyObject: object = {};

// call the different end points for logger
describe('Expected results', () => {
  it('should log the expected messages', () => {
    const log = new ConsoleLogger(LogLevel.TRACE);
    log.debug('debug ConsoleLogger message', loggerObject, loggerObject);
    log.error('error ConsoleLogger message', loggerObject);
    log.info('info ConsoleLogger message', loggerObject);
    log.warn('warn ConsoleLogger message', loggerObject);
  });

  it('should log the expected messages', () => {
    const log = new ConsoleLogger();
    log.error('error ConsoleLogger message', loggerObject);
    log.warn('warn ConsoleLogger message', loggerObject);
  });

});
