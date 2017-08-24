'use strict';

import { EmptyLogger, Logger } from '../src/Logger';
const loggerObject: object = {test: 'test'};
const emptyObject: object = {};

const log = new EmptyLogger();

// call the different end points for logger
describe('Expected results', () => {
  it('should log nothing', () => {
    log.debug('debug logger message', loggerObject);
    log.error('error logger message', loggerObject);
    log.info('info logger message', loggerObject);
    log.warn('warn logger message', loggerObject);
  });

  it('should log nothing for empty messages', () => {
    log.debug('', emptyObject);
  });
});
