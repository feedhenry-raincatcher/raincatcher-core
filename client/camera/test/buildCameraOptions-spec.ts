import { expect } from 'chai';
import { buildCameraOptions } from '../src/buildCameraOptions';
import { mockCordovaCamera } from './mocks/camera';

describe('buildCameraOptions', function() {
  it('should accept a given camera object', function() {
    return expect(buildCameraOptions(mockCordovaCamera)).to.be.ok;
  });
  it('should return a configuration object', function() {
    const opts = buildCameraOptions(mockCordovaCamera);
    expect(opts).to.have.property('quality');
    expect(opts).to.have.property('sourceType');
    expect(opts).to.have.property('destinationType');
    expect(opts).to.have.property('encodingType');
    expect(opts).to.have.property('mediaType');
  });
});
