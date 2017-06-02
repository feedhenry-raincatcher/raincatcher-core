const RaincatcherBase = require('@raincatcher/example-base').default;

RaincatcherBase.prototype.customFunction = function() {
  return this.prefix + ' hello from ES5!';
};

const baseInstance = new RaincatcherBase({
  log: console.log
}, {
  prefix: 'JS'
});

baseInstance.class = RaincatcherBase;

module.exports = baseInstance;
