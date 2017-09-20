## Sync integration

Example for fh-sync cloud module integration.

## Running

    ts-node ./integration/index.ts

## Requirements

`MONGO_CONNECTION_URL` environment variable that points to a mongodb instance.
By default using: mongodb://127.0.0.1:27017/sync

`REDIS_HOST` and `REDIS_PORT` environment variables that points to a running redis instance.
By default using: 127.0.0.1 and 6379

