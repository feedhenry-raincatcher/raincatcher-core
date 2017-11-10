import { stub } from 'sinon';
declare var global: any;

export const resolveLocalFileSystemURL = stub().callsArgAsync(1);

global.window = global.window || {};
global.window.resolveLocalFileSystemURL = resolveLocalFileSystemURL;
