/// <reference types="mocha" />
import { Base } from '../src';

export interface BaseConstructor {
  new(): Base;
}

function baseSuite(Subject: BaseConstructor) {
  describe('Base', function() {
    let subject: Base;
    beforeEach(function() {
      subject = new Subject();
    });
    describe('#foo()', function() {
      it('should receive a string param', function() {
        subject.foo('hello');
      });
    });
  });
}

export default baseSuite;
