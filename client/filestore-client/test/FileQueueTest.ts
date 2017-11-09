import * as  chai from 'chai';
import * as sinon from 'sinon';
import { FileQueue } from '../src/FileQueue';
import { FileQueueEntry } from '../src/FileQueueEntry';

const { expect } = chai;

describe('File Queue Tests', function() {
  const mockQueue = '{"queue": [{"uri": "mockURI", "type": "uri", "id": "mockID"}]}';
  const queueName = 'testFileQueue';
  const mockFileQueueEntry: FileQueueEntry = {
    uri: 'mockURI',
    type: 'uri',
    id: 'mockID'
  };
  let testSubject;
  let mockLocalStorage;

  beforeEach(function() {
    mockLocalStorage = {
      getItem: sinon.stub().returns(mockQueue),
      setItem: sinon.stub()
    };
    testSubject = new FileQueue(mockLocalStorage, queueName);
  });

  it('should be able to add an item to the queue', function() {
    const expectedQueueList: FileQueueEntry[] = [];
    expectedQueueList.push(mockFileQueueEntry);
    testSubject.addItem(mockFileQueueEntry);

    expect(testSubject.getItemList()).to.deep.equal(expectedQueueList);
    sinon.assert.calledOnce(mockLocalStorage.setItem);
    sinon.assert.calledWith(mockLocalStorage.setItem, queueName, JSON.stringify({queue: expectedQueueList}));
  });

  it('should be able to remove an item from the queue', function() {
    testSubject.addItem(mockFileQueueEntry);
    const expectedQueueList: FileQueueEntry[] = [];
    testSubject.removeItem(mockFileQueueEntry);

    expect(testSubject.getItemList()).to.deep.equal(expectedQueueList);
    sinon.assert.calledWith(mockLocalStorage.setItem, queueName, JSON.stringify({queue: expectedQueueList}));
  });

  it('should be able to read an item from the queue', function() {
    testSubject.addItem(mockFileQueueEntry);

    expect(testSubject.readItem(mockFileQueueEntry.id)).to.deep.equal(mockFileQueueEntry);
  });

  it('should restore the local queue data to reflect the queue in local storage', function() {
    const expectedQueueList: FileQueueEntry[] = [];
    expectedQueueList.push(mockFileQueueEntry);

    expect(testSubject.restoreData().getItemList()).to.deep.equal(expectedQueueList);
    sinon.assert.calledOnce(mockLocalStorage.getItem);
    sinon.assert.calledWith(mockLocalStorage.getItem, queueName);
  });

  it('should restore the queue data to an empty array if the queue in the local storage is empty', function() {
    mockLocalStorage = {
      getItem: sinon.stub().returns(undefined),
      setItem: sinon.stub()
    };
    testSubject = new FileQueue(mockLocalStorage, queueName);

    expect(testSubject.restoreData().getItemList()).to.deep.equal([]);
    sinon.assert.calledOnce(mockLocalStorage.getItem);
    sinon.assert.calledWith(mockLocalStorage.getItem, queueName);
  });
});
