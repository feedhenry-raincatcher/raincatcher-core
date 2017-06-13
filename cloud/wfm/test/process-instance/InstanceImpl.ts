import Instance from '../../src/process-instance';
import suite from './index';

describe('InstanceImpl', function() {
  suite(function(data) {
    return new Instance(data);
  });
});
