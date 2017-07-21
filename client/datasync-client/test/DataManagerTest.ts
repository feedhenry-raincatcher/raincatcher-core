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

      return dataManager.list(function(err, dataSetList) {
        sinon.assert.called(mock$fh.doList);

        assert.strictEqual(mockSyncDataSetListAPIResponse.dataentryid.data, dataSetList[0]);
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

      dataManager.create(mockDataItem, function(err, createResult) {
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
        description: 'My New Data Item',
        _localuid: mockRecordUid
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
      return dataManager.read(mockRecordUid, function(err, readRecord) {
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
        _localuid: mockRecordUid,
        name: 'mynewdataitem',
        description: 'My New Data Item'
      };

      const mockSyncAPIResponse = {
        uid: mockRecordUid
      };

      const expectedCreatedData = _.extend({ _localuid: mockSyncAPIResponse.uid }, mockDataItem);

      const mock$fh = {
        doUpdate: sinon.stub().callsArgWith(3, mockSyncAPIResponse),
        doRead: sinon.stub().callsArgWith(2, _.extend({ data: mockDataItem }, mockSyncAPIResponse))
      };

      const DataManager = proxyquire.noCallThru().load('../src/DataManager', {
        'fh-sync-js': mock$fh
      }).DataManager;

      const dataManager = new DataManager(mockDataSetId);

      return dataManager.update(mockDataItem, function(err, createResult) {
        expect(createResult).to.deep.equal(expectedCreatedData);
        sinon.assert.calledOnce(mock$fh.doUpdate);
      });
    });

    it('should remove a single item', function() {
      const mockRecordUid = 'syncRecordUID';

      const mockDataItem = {
        id: 'dataitemid',
        _localuid: mockRecordUid,
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

      return dataManager.delete(mockDataItem, function() {
        sinon.assert.calledOnce(mock$fh.doDelete);
      });
    });
  });

});
