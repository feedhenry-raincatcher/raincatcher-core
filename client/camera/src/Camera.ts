'use strict';

import * as Promise from 'bluebird';
import * as _ from 'lodash';

import {buildCameraOptions} from './buildCameraOptions';

export class Camera {
  private initPromise: Promise<CameraOptions>;
  constructor(optionsBuilderFunction) {
    this.init(optionsBuilderFunction);
  }

  init(optionsFn: (any) => CameraOptions): Promise<CameraOptions> {
    return this.initPromise = new Promise((resolve, reject) => {
      if (!window.navigator.camera) {
        return reject('This module requires the Cordova Camera plugin to be available');
      }
      document.addEventListener("deviceready", function cameraReady() {
        return resolve();
      }, false);
    }).then(() => {
      let options = buildCameraOptions(navigator.camera);
      if (_.isFunction(optionsFn)) {
        var userOptions = optionsFn(navigator.camera);
        options = _.merge(options, userOptions);
      }
      return options;
    });
  };
  
  cleanup(): Promise<void> {
    const cleanup = window.navigator.camera.cleanup;
    return this.initPromise.then(() =>
      new Promise((resolve, reject) => cleanup(resolve, reject)));
  };
  
  capture(): Promise<string> {
    const getPicture = window.navigator.camera.getPicture;
    return this.initPromise.then((cameraOptions) =>
      new Promise((resolve, reject) => getPicture(resolve, reject, cameraOptions)));
  };
}
