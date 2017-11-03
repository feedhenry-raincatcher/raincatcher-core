# RainCatcher FileStore

Server-side [express](https://expressjs.com/) module to support file uploads from the `@raincatcher/filestore-client` module.

## Usage

In order to include this module in an existing express application, use the `createRouter` function and supply an implementation of the `FileStorage` interface.

```typescript
import { createRouter, FileStorage, GridFsStorage } from '@raincatcher/filestore';

//...

const storage: FileStorage = new GridFsStorage(mongoDbConnectionUrl);
expressApp.use('/file', createRouter(storage));
```

## FileStorage Interface

The `FileStorage` is an interface that should be implemented in order to supply an alternative place for file data to be transferred to, based on manipulating [NodeJS Streams](https://nodejs.org/api/stream.html) to allow storage and retrieval of the uploaded binary data.

The [current implementations](./src/impl/) support GridFS (MongoDB's API for storing larger files) and Amazon S3 buckets.