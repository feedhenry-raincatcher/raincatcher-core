
import { SyncOptions, DataSetHandler, SyncDataSetOptions } from '../src/index';
import * as proxyquire from "proxyquire";
import * as assert from 'assert';

const connectOptions: SyncOptions = {
  datasetConfiguration: {
    mongoDbConnectionUrl: process.env.MONGO_CONNECTION_URL || "mongodb://127.0.0.1:27017/sync",
    mongoDbOptions: {},
    redisConnectionUrl: process.env.REDIS_CONNECTION_URL || "redis://127.0.0.1:6379"
  },
  globalSyncOptions: { useCache: false }
}

// Import original and provide mocked version of the api
import { SyncServer } from '../src/SyncServer';
const SyncServerMock = proxyquire.noCallThru().load('../src/SyncServer', {
  'fh-sync': {
    api: {
      setConfig: function () { },
      connect: function (url: any, options: any, redis: any, cb: any) {
        cb();
      },
      handleCollision: function () { },
      setRecordHashFn: function () { },
      globalHandleList: function () { },
      init: function (datasetId: any, options: any, cb: any) {
        cb();
      }
    }
  }
});

// Custom dataset handler
class MyTestDataSetHandler implements DataSetHandler {
  onList(datasetId: string, params: any, metaData: any, callback: (err: Error | string | undefined, res: any | undefined) => void) {
    callback(undefined, [{ test: "test" }]);
  }
}

describe("FeedHenry Sync Tests", function () {
  let testSubject: SyncServer;
  beforeEach(function () {
    testSubject = new SyncServerMock.SyncServer();
  });
  describe('Test end user api', function () {
    it('connect', function () {
      return testSubject.connect(connectOptions, function (err) {
        assert.ok(!err, "No error happened");
      })
    });

    it('setGlobalHandlers can be called', function () {
      let handler: DataSetHandler = new MyTestDataSetHandler();
      return testSubject.setGlobalDataHandlers(handler);
    });

    it('registerDatasetDataHandler can be called', function () {
      let options: SyncDataSetOptions = {
        backendListTimeout: 20,
        hashFunction: function () { },
        collisionHandler: function () { }
      };
      let handler: DataSetHandler = new MyTestDataSetHandler();
      return testSubject.registerDatasetDataHandler("test", options, handler);
    });
  });
});
