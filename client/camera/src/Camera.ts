'use strict';

import * as Promise from 'bluebird';
import * as _ from 'lodash';

import { buildCameraOptions } from './buildCameraOptions';

declare var window;

export const TYPE_IMAGE_BASE64 = 'BASE64';
export const TYPE_IMAGE_URI = 'URI';

/**
 * Defines response for camera capture
 */
export interface CaptureReponse {
  type: typeof TYPE_IMAGE_BASE64 | typeof TYPE_IMAGE_URI;
  value: string;
}

// tslint:disable-next-line:no-var-requires
const base64ToBlob: (base64: string, contentType?: string) => Blob = require('b64-to-blob');

type optionsBuilderFn = (camera: any) => CameraOptions;

export class Camera {
  private initPromise: Promise<CameraOptions>;

  constructor(optionsBuilderFunction?: optionsBuilderFn) {
    this.init(optionsBuilderFunction);
  }

  public init(optionsFn?: optionsBuilderFn): Promise<CameraOptions> {
    return this.initPromise = new Promise((resolve, reject) => {
      if (window.cordova) {
        document.addEventListener('deviceready', function() {
          if (!window.navigator.camera) {
            return reject(new Error('This module requires the Cordova Camera plugin to be available'));
          }
          return resolve();
        }, false);
      } else {
        resolve();
      }
    }).then(() => {
      let options = buildCameraOptions(navigator.camera);
      if (_.isFunction(optionsFn)) {
        const userOptions = optionsFn(navigator.camera);
        options = _.merge(options, userOptions);
      }
      return options;
    });
  }

  public cleanup(): Promise<void> {
    const cleanup = window.navigator.camera.cleanup;
    return this.initPromise.then(() =>
      new Promise((resolve, reject) => cleanup(resolve, reject)));
  }

  public capture(): Promise<CaptureReponse> {
    const getPicture = window.navigator.camera.getPicture;
    const self = this;
    return this.initPromise.then((cameraOptions) =>
      new Promise<string>((resolve, reject) => getPicture(resolve, reject, cameraOptions)))
      .then(uri => new Promise<CaptureReponse>((resolve, reject) => window.resolveLocalFileSystemURL(uri, function() {
        // Cordova's camera plugin only has options to save pictures to the OS' public gallery, shared with other apps
        return resolve({ value: uri, type: TYPE_IMAGE_URI });
      }, function onFileSystemURIError() {
        // Can be a data-uri when running in a browser, resolving will fail
        // in this case, convert the base64 string into an ObjectUrl
        const blob = base64ToBlob(uri);
        resolve({ value: window.URL.createObjectURL(blob), type: TYPE_IMAGE_BASE64 });
      }))
      );
  }
}
