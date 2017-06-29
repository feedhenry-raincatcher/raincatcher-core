import {ProcessInstanceImpl} from '../../src/process-instance/ProcessInstanceImpl';
import {suite} from './index';

describe('InstanceImpl', function() {
  suite(function(data) {
    return new ProcessInstanceImpl(data);
  });
});
