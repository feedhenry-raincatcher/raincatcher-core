/// <reference types="mocha" />
import * as debug from 'debug';
debug.enable('*');

import LoggerImpl from '../src';

function baseSuite() {
  describe('Base', function() {
    let subject: LoggerImpl;
    beforeEach(function() {
      subject =  LoggerImpl.getInstance();
      subject.setNamespace('base siute');
    });
    describe('#foo()', function() {
      it('should receive a string param', function() {
        subject.error('hello');
      });
    });
  });
}

export default baseSuite;
