/// <reference types="mocha" />
'use strict';

import { BunyanLogger } from '../src/BunyanLogger';
import { logger, setLogger } from '../src/LoggerManager';
const loggerObject: object = {test: 'test'};
const emptyObject: object = {};

const log = new BunyanLogger({name: 'test'});
setLogger(log);
// call the different end points for logger
describe('Expected results', () => {
  it('should log the expected messages', () => {
    logger.debug('debug logger message', loggerObject, loggerObject);
    logger.error('error logger message', loggerObject);
    logger.info('info logger message', loggerObject);
    logger.warn('warn logger message', loggerObject);
  });

  it('should log nothing for empty messages', () => {
    logger.debug('', emptyObject);
  });
});

