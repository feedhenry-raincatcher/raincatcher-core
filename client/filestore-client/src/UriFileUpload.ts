import * as Bluebird from 'bluebird';

/**
 * Upload file using dataUrl.
 * Used by local desktop camera when app running on non mobile environments
 */
export function uploadDataUrl(serverUrl, httpService, userId, dataUrl) {
  if (arguments.length < 2) {
    return Bluebird.reject('Both userId and a dataUrl parameters are required.');
  } else {
    const request = {
      url: serverUrl,
      data: dataUrl
    };
    return httpService.post(request);
  }
}
