import { expect } from 'chai';
import { buildCameraOptions } from '../src/buildCameraOptions';
import { Camera } from '../src/Camera';
import { mockCordovaCamera } from './mocks/camera';

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
    xit('should call the cordova cleanup function', function() {
      subject.cleanup();
    });
  });
  describe('capture', function() {
    it('should resolve to a local file uri');
  });
});
