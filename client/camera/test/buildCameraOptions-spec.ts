import { expect } from 'chai';
import { buildCameraOptions } from '../src/buildCameraOptions';

describe('buildCameraOptions', function() {
  const mockCordovaCamera = {
    DestinationType: {
      FILE_URI: 1
    },
    EncodingType: {
      JPEG: 1
    },
    PictureSourceType: {
      CAMERA: 1
    },
    MediaType: {
      PICTURE: 1
    }
  };
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
