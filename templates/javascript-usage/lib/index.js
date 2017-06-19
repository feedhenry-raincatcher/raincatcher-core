"use strict";
// CommonJS clients must require('...').default when using es6 modules
const RaincatcherBase = require('@raincatcher/example-base').default;

const logger = {
  log: console.log
};
class MyClass extends RaincatcherBase {
  constructor() {
    super(logger, {
      prefix: 'JS'
    });
  }

  customFunction() {
    return this.prefix + ' hello from ES6!';
  }
}

const baseInstance = new MyClass();

baseInstance.class = MyClass;

module.exports = baseInstance;
