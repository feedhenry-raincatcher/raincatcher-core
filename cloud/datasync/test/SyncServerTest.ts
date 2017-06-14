import * as assert from 'assert';
import * as proxyquire from 'proxyquire';
import {DataSetHandler, SyncApi, SyncDataSetOptions, SyncOptions} from '../src/index';
// Import original and provide mocked version of the api

const connectOptions: SyncOptions = {
  datasetConfiguration: {
    mongoDbConnectionUrl: process.env.MONGO_CONNECTION_URL || 'mongodb://127.0.0.1:27017/sync',
    mongoDbOptions: {},
    redisConnectionUrl: process.env.REDIS_CONNECTION_URL || 'redis://127.0.0.1:6379'
  },
  globalSyncOptions: {useCache: false}
};

const SyncServerMock = proxyquire.noCallThru().load('../src/SyncServer', {
  'fh-sync': {
    // tslint:disable-next-line:no-empty
    setConfig() {
    },
    connect(url: any, options: any, redis: any, cb: any) {
      cb();
    },
    // tslint:disable-next-line:no-empty
    handleCollision() {
    },
    // tslint:disable-next-line:no-empty
    setRecordHashFn() {
    },
    // tslint:disable-next-line:no-empty
    globalHandleList() {
    },
    init(datasetId: any, options: any, cb: any) {
      cb();
    }
  }
});

// Custom dataset handler
class MyTestDataSetHandler implements DataSetHandler {
  public onList(datasetId: string, params: any, metaData: any, callback: any) {
    callback(undefined, [{test: 'test'}]);
  }
}

describe('FeedHenry Sync Tests', function() {
  let testSubject: SyncApi;
  beforeEach(function() {
    testSubject = SyncServerMock.SyncServer;
  });
  describe('Test end user api', function() {
    it('connect', function() {
      return testSubject.connect(connectOptions, function(err: any) {
        assert.ok(!err, 'No error happened');
      });
    });

    it('setGlobalHandlers can be called', function() {
      const handler: DataSetHandler = new MyTestDataSetHandler();
      return testSubject.setGlobalDataHandlers(handler);
    });

    it('registerDatasetDataHandler can be called', function() {
      const options: SyncDataSetOptions = {
        backendListTimeout: 20,
        // tslint:disable-next-line:no-empty
        hashFunction() {
        },
        // tslint:disable-next-line:no-empty
        collisionHandler() {
        }
      };
      const handler: DataSetHandler = new MyTestDataSetHandler();
      return testSubject.registerDatasetDataHandler('test', options, handler);
    });
  });
});
