/// <reference types="mocha" />
'use strict';

import * as chai from 'chai';
import { BunyanLogger } from '../src/BunyanLogger';
const expect = chai.expect;

const loggerObject: object = { index: 'index' };

const log = new BunyanLogger({ name: 'testLogger' });

// call the different end points for logger
describe('Expected results', () => {

  it('should log the expected messages', () => {
    log.debug('Bunyan debug logger message', loggerObject);
    log.error('error logger message', loggerObject);
    log.info('info logger message', loggerObject);
    log.warn('warn logger message', loggerObject);
    log.debug('DEBUG');
    log.info('INFO');
    log.warn('WARN');
    log.error('ERROR');
  });

  it('should log nothing for empty messages', () => {
    log.debug('');
  });
});
