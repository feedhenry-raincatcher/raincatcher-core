import * as Promise from 'bluebird';
import { expect } from 'chai';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import { buildCameraOptions } from '../src/buildCameraOptions';
import { Camera } from '../src/Camera';
import { mockCordovaCamera } from './mocks/camera';
import { resolveLocalFileSystemURL } from './mocks/file';

declare var global: any;

chai.use(chaiAsPromised);

describe('Camera', function() {
  const subject = new Camera(function() {
    return { quality: 80 };
  });

  describe('init', function() {
    it('should take a function to partially supply options', function() {
      return expect(subject.initPromise).to.eventually.have.property('quality', 80);
    });
  });
  describe('cleanup', function() {
    it('should call the cordova cleanup function', function() {
      return subject.cleanup().then(function() {
        sinon.assert.called(mockCordovaCamera.cleanup);
      });
    });
  });
  describe('capture', function() {
    it('return a local uri when successful', function() {
      return subject.capture().then(result => {
        expect(result).to.deep.equal({
          type: 'uri',
          value: 'some-uri'
        });
        sinon.assert.called(resolveLocalFileSystemURL);
      });
    });

    it('should return a base64 data-uri when not a local file', function() {
      // replace cordova file function to call error callback
      const failingResolveLocalFileSystemURL = sinon.stub().callsArg(2);
      global.window.resolveLocalFileSystemURL = failingResolveLocalFileSystemURL;

      return subject.capture().then(result => {
        sinon.assert.called(failingResolveLocalFileSystemURL);
        expect(result).to.deep.equal({
          value: 'data:image/jpg;base64,some-uri',
          type: 'base64'
        });
      });
    });
  });
});
