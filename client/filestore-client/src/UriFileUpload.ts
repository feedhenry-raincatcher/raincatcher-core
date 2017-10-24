import * as Bluebird from 'bluebird';

// TODO
/**
 * Upload file using dataUrl.
 * Used by local desktop camera when app running on non mobile environments
 */
export function uploadDataUrl(serverUrl, httpService, dataUrl) {
  const request = {
    url: serverUrl,
    data: dataUrl
  };
  return httpService.post(request);
}
