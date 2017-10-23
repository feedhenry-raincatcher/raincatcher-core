import * as Bluebird from 'bluebird';

/**
 * Upload file using dataUrl.
 * Used by local desktop camera when app running on non mobile environments
 */
export function uploadDataUrl(baseUrl, httpService, userId, dataUrl) {
  if (arguments.length < 2) {
    return Bluebird.reject('Both userId and a dataUrl parameters are required.');
  } else {
    const request = {
      url: baseUrl + '/owner/' + userId + '/upload/base64/photo.png',
      data: dataUrl
    };
    return httpService.post(request);
  }
}
