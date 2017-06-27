import * as assert from 'assert';
import {SyncExpressMiddleWare} from '../src/index';

import {suite,test} from 'mocha-typescript';
import * as express from 'express';

@suite
class SyncWebExpressTest{
  private syncExpressMidlleware : SyncExpressMiddleWare;

  public before(){
    this.syncExpressMidlleware = new SyncExpressMiddleWare('prefix')
  }

  @test
  public createRouter(){
    let createdRouter: express.Router = this.syncExpressMidlleware.createSyncExpressRouter();
    assert.ok(createdRouter,"Failed to create router");
  }

  @test
  public getRouter(){
    let routerInstance: express.Router = this.syncExpressMidlleware.getRouter();
    assert.ok(routerInstance, "Failed to retreive router instance");
  }
}

