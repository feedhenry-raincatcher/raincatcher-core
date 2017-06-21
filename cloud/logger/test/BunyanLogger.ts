/// <reference types="mocha" />
'use strict';
import * as bunyan from 'bunyan';
import { expect } from 'chai';
import * as proxyquire from 'proxyquire';

// const BunyanLogger = proxyquire.noCallThru().load('../src/BunyanLogger', {
//
// });

import {BunyanLogger} from '../src/BunyanLogger';
const loggerObject: object = {test: 'test'};
const emptyObject: object = {};

const log = new BunyanLogger({name: 'test'});

// call the different end points for logger
describe('Expected results', () => {
 it('should return the expected responses', () => {
   log.debug('debug logger message', loggerObject);
   log.error('error logger message', loggerObject);
   log.info('info logger message', loggerObject);
   log.warn('warn logger message', loggerObject);
  });

 it('should log nothing for empty messages', () => {
   log.debug('', emptyObject);
 });
});
