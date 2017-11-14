import * as  chai from 'chai';
import * as chaiAsPromise from 'chai-as-promised';
import * as proxyquire from 'proxyquire';
import * as sinon from 'sinon';
import { FileManager } from '../src/FileManager';
import { FileQueue } from '../src/FileQueue';
import { FileQueueEntry } from '../src/FileQueueEntry';
import { HttpClient } from '../src/HttpClient';

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
    getItem: sinon.stub().returns('{"queue": []}')
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

  const buildUploadFileMock = function() {
    const stub = sinon.stub();
    stub.withArgs(mockFileOnline).resolves(fileCreatedMessage);
    stub.withArgs(mockFileOffline).rejects(fileNotCreatedMessage);
    stub.rejects('offline');
    return stub;
  };

  const CordovaFileSupportMock = function(serverUrl, HttpInterface) {
    return {
      downloadFileFromServer: sinon.stub(),
      uploadFile: buildUploadFileMock()
    };
  };

  let testSubject: FileManager;

  // Mock DOM objects used by FileManager
  global.document = {
    addEventListener: sinon.stub()
  };
  global.window = {
    localStorage: mockLocalStorage
  };

  const FileManagerProxy: {
    new(serverUrl: string, name: string, httpInterface: HttpClient): FileManager
  } = proxyquire.load('../src/FileManager', {
    './CordovaFileSupport': {
      'CordovaFileSupport': CordovaFileSupportMock
    }
  }).FileManager;

  beforeEach(function() {
    testSubject = new FileManagerProxy(mockServerUrl, mockFileQueueName, mockHttpClient);
  });

  it('should upload a file when the device is online', function() {
    return testSubject.scheduleFileToBeUploaded(mockFileOnline).then(function(result) {
      expect(result).to.equal(fileCreatedMessage);
    });
  });

  it('should not upload a file when the device is offline', function() {
    return testSubject.scheduleFileToBeUploaded(mockFileOffline);
  });
});
