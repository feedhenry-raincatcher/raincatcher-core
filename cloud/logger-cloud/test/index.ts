/// <reference types="mocha" />
'use strict';
import * as assert from 'assert';
import {BunyanLogger,LOG_LEVEL} from '../src/index';
import { expect } from 'chai';

// constructor for loggers
const logD = new BunyanLogger(LOG_LEVEL.debug).debug;
/*const logE = new BunyanLogger(LOG_LEVEL.ERROR).error;
const logI = new BunyanLogger(LOG_LEVEL.INFO).info;
//const logL = new BunyanLogger(LOG_LEVEL.LOG).logger.log;
const logW = new BunyanLogger(LOG_LEVEL.WARN).warn;*/

const loggerObject:object = {test:"test"};
const emptyObject:object = {};

describe('Expected results', () => {
 it('should return the expected responses', () => {
   logD('debug logger message', loggerObject);
   //console.log(a);
   //expect(a);
   /*logE('error logger message', loggerObject);
   logI('info logger message', loggerObject);
   //logL('log logger message', loggerObject);
   logW('warn logger message', loggerObject);*/
  });

  it('should log nothing for empty messages', () => {
    logD('', emptyObject);
/*
    logE('', emptyObject);
    logI('', emptyObject);
    //logL('', emptyObject);
    logW('', emptyObject);
*/
  });
});




//export default baseSuite;
