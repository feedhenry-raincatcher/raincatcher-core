import ProcessImpl from '../../src/process';
import suite from './index';

describe('ProcessImpl', function() {
  suite(name => new ProcessImpl(name));
});
