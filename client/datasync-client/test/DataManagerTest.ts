/// <reference types="mocha" />

import * as assert from 'assert';
import * as chai from 'chai';
import * as _ from 'lodash';
import * as proxyquire from 'proxyquire';
import * as sinon from 'sinon';

const expect = chai.expect;

describe('Data Manager', function() {

  const mockDataSetId = 'mockdatasetid';

  beforeEach(function() {
    const self = this;
  });

  describe('CRUDL Operations', function() {
    it('should list all items', function() {
      // An example of a list API Response From the $fh.sync framework
      const mockSyncDataSetListAPIResponse = {
        'dataentryid': {
          data: {
            id: 'SomeDataItemId'
          },
          hash: 'somedatahashforthedataset'
        }
      };

      const mock$fh = {
        doList: sinon.stub().callsArgWith(1, mockSyncDataSetListAPIResponse)
      };

      const DataManager = proxyquire.noCallThru().load('../src/DataManager', {
        'fh-sync-js': mock$fh
      }).DataManager;

      const dataManager = new DataManager(mockDataSetId);

      return dataManager.list().then(function(dataSetList) {
        sinon.assert.called(mock$fh.doList);
        assert.strictEqual(mockSyncDataSetListAPIResponse.dataentryid.data, dataSetList[0]);
      });
    });

    it('should error when list all items', function() {
      // An example of a list API Response From the $fh.sync framework
      const mock$fh = {
        doList: sinon.stub().callsArgWith(2, 'Problem')
      };

      const DataManager = proxyquire.noCallThru().load('../src/DataManager', {
        'fh-sync-js': mock$fh
      }).DataManager;

      const dataManager = new DataManager(mockDataSetId);

      return dataManager.list().catch(function(err) {
        sinon.assert.called(mock$fh.doList);
        assert.ok(err);
      });
    });

    it('should create a new item', function() {

      const mockRecordUid = 'syncRecordUID';

      const mockDataItem = {
        name: 'mynewdataitem',
        description: 'My New Data Item'
      };

      const mockSyncAPIResponse = {
        uid: mockRecordUid
      };

      const expectedCreatedData = _.extend({ uid: mockSyncAPIResponse.uid }, mockDataItem);

      const mock$fh = {
        doCreate: sinon.stub().callsArgWith(2, mockSyncAPIResponse),
        doUpdate: sinon.stub().callsArgWith(3, mockSyncAPIResponse),
        doRead: sinon.stub().callsArgWith(2, _.extend({ data: mockDataItem }, mockSyncAPIResponse))
      };

      const DataManager = proxyquire.noCallThru().load('../src/DataManager', {
        'fh-sync-js': mock$fh
      }).DataManager;

      const dataManager = new DataManager(mockDataSetId);

      dataManager.create(mockDataItem).then(function(createResult) {
        expect(createResult).to.deep.equal(expectedCreatedData);

        sinon.assert.calledOnce(mock$fh.doCreate);
        sinon.assert.calledWith(mock$fh.doCreate,
          sinon.match(mockDataSetId), sinon.match(mockDataItem),
          sinon.match.func, sinon.match.func);
      });
    });

    it('should read a single item', function() {
      const mockRecordUid = 'syncRecordUID';

      const mockDataItem = {
        name: 'mynewdataitem',
        description: 'My New Data Item'
      };

      const mockSyncAPIResponse = {
        uid: mockRecordUid
      };

      const mock$fh = {
        doRead: sinon.stub().callsArgWith(2, _.extend({ data: mockDataItem }, mockSyncAPIResponse))
      };

      const DataManager = proxyquire.noCallThru().load('../src/DataManager', {
        'fh-sync-js': mock$fh
      }).DataManager;

      const dataManager = new DataManager(mockDataSetId);
      return dataManager.read(mockRecordUid).then(function(readRecord) {
        expect(readRecord).to.deep.equal(mockDataItem);

        sinon.assert.calledOnce(mock$fh.doRead);
        sinon.assert.calledWith(mock$fh.doRead,
          sinon.match(mockDataSetId), sinon.match(mockRecordUid),
          sinon.match.func, sinon.match.func);
      });
    });

    it('should update a new item', function() {
      const mockRecordUid = 'syncRecordUID';

      const mockDataItem = {
        name: 'mynewdataitem',
        description: 'My New Data Item'
      };

      const mockSyncAPIResponse = {
        uid: mockRecordUid
      };

      const expectedCreatedData = _.extend(mockDataItem);

      const mock$fh = {
        doUpdate: sinon.stub().callsArgWith(3, mockSyncAPIResponse),
        doRead: sinon.stub().callsArgWith(2, _.extend({ data: mockDataItem }, mockSyncAPIResponse))
      };

      const DataManager = proxyquire.noCallThru().load('../src/DataManager', {
        'fh-sync-js': mock$fh
      }).DataManager;

      const dataManager = new DataManager(mockDataSetId);

      return dataManager.update(mockDataItem).then(function(createResult) {
        expect(createResult).to.deep.equal(expectedCreatedData);
        sinon.assert.calledOnce(mock$fh.doUpdate);
      });
    });

    it('should notify about updates', function() {
      let mock$fh = {
        notify: sinon.stub().callsArgWith(1)
      };
      const DataManager = proxyquire.noCallThru().load('../src/DataManager', {
        'fh-sync-js': mock$fh
      }).DataManager;
      const dataManager = new DataManager(mockDataSetId);
      dataManager.subscribeToDatasetUpdates(function() {
        sinon.assert.notCalled(mock$fh.notify);
      });
      mock$fh = {
        notify: sinon.stub().callsArgWith(1, { code: 'delta_received' })
      };
      return dataManager.subscribeToDatasetUpdates(function() {
        sinon.assert.calledOnce(mock$fh.notify);
      });
    });

    it('should remove a single item', function() {
      const mockRecordUid = 'syncRecordUID';

      const mockDataItem = {
        id: 'dataitemid',
        name: 'mynewdataitem',
        description: 'My New Data Item'
      };

      const mock$fh = {
        doDelete: sinon.stub().callsArgWith(2)
      };

      const DataManager = proxyquire.noCallThru().load('../src/DataManager', {
        'fh-sync-js': mock$fh
      }).DataManager;

      const dataManager = new DataManager(mockDataSetId);

      return dataManager.delete(mockDataItem).then(function() {
        sinon.assert.calledOnce(mock$fh.doDelete);
      });
    });
  });

  it('should start stop', function() {
    const mockRecordUid = 'syncRecordUID';
    const mock$fh = {
      startSync: sinon.stub().callsArgWith(1),
      stopSync: sinon.stub().callsArgWith(1)
    };

    const DataManager = proxyquire.noCallThru().load('../src/DataManager', {
      'fh-sync-js': mock$fh
    }).DataManager;

    const dataManager = new DataManager(mockDataSetId);

    return dataManager.start().then(function(error) {
      assert.ok(!error);
      dataManager.stop().then(function(err) {
        assert.ok(!err);
      });
    });
  });

  it('should force sync', function() {
    const mockRecordUid = 'syncRecordUID';
    const mock$fh = {
      forceSync: sinon.stub().callsArgWith(1)
    };
    const DataManager = proxyquire.noCallThru().load('../src/DataManager', {
      'fh-sync-js': mock$fh
    }).DataManager;

    const dataManager = new DataManager(mockDataSetId);
    return dataManager.forceSync().then(function(error) {
      assert.ok(!error);
    });
  });

  it('should safeStop', function() {
    const mockRecordUid = 'syncRecordUID';
    const results = [];
    const mock$fh = {
      forceSync: sinon.stub().callsArgWith(1),
      getPending: sinon.stub().callsArgWith(1, results)
    };

    const DataManager = proxyquire.noCallThru().load('../src/DataManager', {
      'fh-sync-js': mock$fh
    }).DataManager;

    const dataManager = new DataManager(mockDataSetId);

    return dataManager.safeStop({ delay: 1 }).then(function(error) {
      assert.ok(!error);
    });
  });
});
