'use strict';

import * as Promise from 'bluebird';
import * as _ from 'lodash';
import { FileManager, FileEntry } from '@raincatcher/filestore-client';

import { buildCameraOptions } from './buildCameraOptions';

const base64ToBlob: (base64: string, contentType: string) => Blob = require('b64-to-blob');

type optionsBuilderFn = (any) => CameraOptions;

export class Camera {
  private initPromise: Promise<CameraOptions>;
  private fileManager: FileManager;
  constructor(serverUrl: string , optionsBuilderFunction?: optionsBuilderFn) {
    this.fileManager = new FileManager(serverUrl, 'camera');
    this.init(optionsBuilderFunction);
  }

  init(optionsFn?: optionsBuilderFn): Promise<CameraOptions> {
    return this.initPromise = new Promise((resolve, reject) => {
      if (!window.navigator.camera) {
        return reject('This module requires the Cordova Camera plugin to be available');
      }
      document.addEventListener("deviceready", resolve, false);
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

  capture(): Promise<FileEntry> {
    const getPicture = window.navigator.camera.getPicture;
    const self = this;
    return this.initPromise.then((cameraOptions) =>
      new Promise<string>((resolve, reject) => getPicture(resolve, reject, cameraOptions)))
      .then(uri => new Promise<string>((resolve, reject) => window.resolveLocalFileSystemURL(uri, function() {
        // Cordova's camera plugin only has options to save pictures to the OS' public gallery, shared with other apps
        return resolve(uri);
      }, function onFileSystemURIError() {
        // Can be a data-uri when running in a browser,
        // so resolving will fail

        // in this case, convert the base64 string into an ObjectUrl
        const blob = base64ToBlob(uri, 'image/jpg');
        resolve(window.URL.createObjectURL(blob));
      }))
      ).then(function(uri) {
        const file: FileEntry = {
          uri,
          userId: "max"
        };
        self.fileManager.scheduleFileToBeUploaded(file);
        return file;
      });
  };
}
