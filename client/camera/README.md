# RainCatcher Cordova Camera Wrapper

Wrapper around the [Cordova Camera Plugin](https://github.com/apache/cordova-plugin-camera) that uses the File Store client.

## Example

```typescript
import { Camera } from '@raincatcher/camera');
const camera = new Camera();
camera.capture().then(function(captureResponse) {
  const file = {
    uri: captureResponse.value,
    type: captureResponse.type,
  };
  // Uri can be used to display file
  return file;
}
```
