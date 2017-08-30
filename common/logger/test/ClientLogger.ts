/// <reference types="mocha" />
'use strict';

import { ClientLogger } from '../src/ClientLogger';
const loggerObject: object = { test: 'test' };
const emptyObject: object = {};

// call the different end points for logger
describe('Expected results', () => {
  it('should log the expected messages', () => {
    const log = new ClientLogger(LogLevel.TRACE);
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
