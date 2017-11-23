# RainCatcher FileStore client

RainCatcher FileStore Client provides a manager which provides the support for:

- Downloading files from a server.
- Uploading files from a mobile device to a server.

## Usage
1. Implement the [HttpClient](./src/HttpClient.ts) Interface

2. Import FileManager
```javascript
var FileManager = require('@raincatcher/filestore-client').FileManager;
...
var fileManager = new FileManager(serverUrl, fileQueueName, httpClient);
```

3. Use the FileManager for uploading/downloading files to and from the server.
```javascript
fileManager.scheduleFileToBeUploaded(fileQueueEntry);
fileManager.scheduleFileToBeDownloaded(fileQueueEntry);
```
- Ensure the fileQueueEntry adheres to the [FileQueueEntry](./src/FileQueueEntry.ts) interface.

## HttpClient Interface

The [HttpClient](./src/HttpClient.ts) interface should be implemented in order to enable the FileStore client to make network requests for uploading and downloading files to and from a server.
