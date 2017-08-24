'use strict';
import * as assert from 'assert';
import * as express from 'express';
import { SessionOptions } from 'express-session';
import { EndpointSecurity } from '../src/EndpointSecurity';

class Test implements EndpointSecurity {
  public init(app: express.Express, sessionOpts: SessionOptions): void {
    console.info('test');
  }
  public protect(role?: string | undefined): express.Handler {
    return function() {
      console.info('test');
    };
  }
}

// call the different end points for logger
describe('Expected results', () => {
  it('Test interface methods', () => {
    const test: EndpointSecurity = new Test();
    assert.ok(test.protect());
  });
});
