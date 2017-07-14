/// <reference types="mocha" />
'use strict';

import { BunyanLogger } from '../src/BunyanLogger';
import { LoggerManager } from '../src/LoggerManager';
const loggerObject: object = {test: 'test'};
const emptyObject: object = {};
const log = new LoggerManager();
log.logger = new BunyanLogger({name: 'test'});
log.setLogger(log.logger);
// call the different end points for logger
describe('Expected results', () => {
  it('should log the expected messages', () => {
    log.logger.debug('debug logger message', loggerObject, loggerObject);
    log.logger.error('error logger message', loggerObject);
    log.logger.info('info logger message', loggerObject);
    log.logger.warn('warn logger message', loggerObject);
  });

  it('should log nothing for empty messages', () => {
    log.logger.debug('', emptyObject);
  });
});

