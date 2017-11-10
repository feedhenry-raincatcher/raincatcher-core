import { stub } from 'sinon';
export const mockCordovaCamera = {
  // properties
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
  },
  // methods
  cleanup: stub().callsArgAsync(0),
  getPicture: stub().callsArgWithAsync(0, 'some-uri')
};

declare var global: any;
global.window = global.window || {};
global.navigator = global.navigator || {};
global.window.navigator = global.navigator;

global.window.camera = mockCordovaCamera;
global.navigator.camera = mockCordovaCamera;
