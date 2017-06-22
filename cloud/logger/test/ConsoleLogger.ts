/// <reference types="mocha" />
'use strict';

import {ConsoleLogger} from '../src/ConsoleLogger';
const loggerObject: object = {test: 'test'};
const emptyObject: object = {};

const log = new ConsoleLogger();

// call the different end points for logger
describe('Expected results', () => {
  it('should log the expected messages', () => {
    log.debug('debug logger message', loggerObject, loggerObject);
    log.error('error logger message', loggerObject);
    log.info('info logger message', loggerObject);
    log.warn('warn logger message', loggerObject);
  });

  it('should log nothing for empty messages', () => {
    log.debug('', emptyObject);
  });
});
