import * as  chai from 'chai';
import * as chaiAsPromise from 'chai-as-promised';
import * as proxyquire from 'proxyquire';
import * as sinon from 'sinon';
import { FileQueue } from '../src/FileQueue';
import { FileQueueEntry } from '../src/FileQueueEntry';

declare var global: NodeJS.Global | any;

const { expect } = chai;

describe('File Manager Tests', function() {
  const mockServerUrl = 'mockServerUrl';
  const mockFileQueueName = 'mockQueueName';
  const mockHttpClient = {
    upload: sinon.stub(),
    download: sinon.stub()
  };
  const mockLocalStorage = {
    setItem: sinon.stub(),
    getItem: sinon.stub().returns('{}')
  };

  const mockFileOnline: FileQueueEntry = {
    uri: 'mockURIOnline',
    type: 'uri',
    id: 'mockFileIdOnline'
  };

  const mockFileOffline: FileQueueEntry = {
    uri: 'mockURIOffline',
    type: 'uri',
    id: 'mockFileIdOffline'
  };

  const fileCreatedMessage = 'mockFileCreated';
  const fileNotCreatedMessage = 'mockFileNotCreated';

  const mockUploadFile = function() {
    const stub = sinon.stub();
    stub.withArgs(mockFileOnline).resolves(fileCreatedMessage);
    stub.withArgs(mockFileOffline).rejects(fileNotCreatedMessage);
    stub.rejects('offline');
    return stub;
  };

  const CordovaFileSupport = function(serverUrl, HttpInterface) {
    return {
      downloadFileFromServer: sinon.stub(),
      uploadFile: mockUploadFile()
    };
  };

  let testSubject;

  // Mock DOM objects used by FileManager
  global.document = {
    addEventListener: sinon.stub()
  };
  global.window = {
    localStorage: mockLocalStorage
  };

  const FileManager = proxyquire.load('../src/FileManager', {
    './CordovaFileSupport': {
      'CordovaFileSupport': CordovaFileSupport
    }
  }).FileManager;

  beforeEach(function() {
    testSubject = new FileManager(mockServerUrl, mockFileQueueName, mockHttpClient);
  });

  it('should upload a file when the device is online', function(done) {
    testSubject.scheduleFileToBeUploaded(mockFileOnline).then(function(result) {
      expect(result).to.equal(fileCreatedMessage);
      done();
    });
  });

  it('should not upload a file when the device is offline', function(done) {
    testSubject.scheduleFileToBeUploaded(mockFileOffline).then(function(result) {
      console.log('result', result);
      done();
    }).catch(function(err) {
      console.log('err', err);
      done();
    });
  });
});
