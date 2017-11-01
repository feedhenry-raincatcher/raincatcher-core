'use strict';

import * as Promise from 'bluebird';
import * as _ from 'lodash';

import { buildCameraOptions } from './buildCameraOptions';

declare var window;

/**
 * Defines response for camera capture
 */
export interface CaptureResponse {
  type: 'base64' | 'uri';
  value: string;
}

type optionsBuilderFn = (camera: any) => CameraOptions;

export class Camera {
  protected initPromise: Promise<CameraOptions>;
  protected options: CameraOptions;

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
      // assign options object to self for convenience
      this.options = options;
      return options;
    });
  }

  public cleanup(): Promise<void> {
    const cleanup = window.navigator.camera.cleanup;
    return this.initPromise.then(() =>
      new Promise((resolve, reject) => cleanup(resolve, reject)));
  }

  public capture(): Promise<CaptureResponse> {
    const getPicture = window.navigator.camera.getPicture;
    const self = this;
    return this.initPromise.then((cameraOptions) =>
      new Promise<string>((resolve, reject) => getPicture(resolve, reject, cameraOptions)))
      .then(uri => new Promise<CaptureResponse>((resolve, reject) => window.resolveLocalFileSystemURL(uri, function() {
        return resolve({ value: uri, type: 'uri' });
      }, function onFileSystemURIError() {
        // Can be a base64 string when running in a browser, resolveLocalFileSystemURL will fail
        // in this case, send value as dataURI
        const mimeType = self.options.mediaType === window.navigator.camera.EncodingType.JPEG ?
          'image/jpg' : 'image/png';
        resolve({ value: `data:${mimeType};base64,${uri}`, type: 'base64' });
      }))
      );
  }
}
