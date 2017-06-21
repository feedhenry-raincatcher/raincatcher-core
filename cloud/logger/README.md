# RainCatcher Logger Cloud

This module creates logging facade for node.js based applications that is used by all Raincatcher modules.
Users can use their own loggers by wrapping them into provided interface.
By default module provides [Bunyan](https://www.npmjs.com/package/bunyan) logger implementation.

## Quick start

Implement Logger interface to be used with your logging library of choice e.g. Bunyan
```typescript
  import * as bunyan from 'bunyan';
  import Logger from './Logger';

  export class BunyanLogger implements Logger {....}
```

change the `./src/index.ts` to reflect the new logger
## Usage

Import the your logger implementation and the Logger interface to be used.
```typescript
  import {BunyanLogger, Logger} from '../src/index';

  // constructor needs at least name
  const log: Logger = new BunyanLogger({name: 'index'});

  log.info('info logger message', {test: 'info object'});
```

See `./integration/index.ts` for usage

### Unit tests

`npm run test` - execute unit tests


### Supported scripts


| Command        | Description           |
| :------------- |:-------------|
| `npm run clean` | removes all compiled sources |
| `npm run build` | build typescript code |
| `npm run start` | run module (valid only for top level modules) |
| `npm run test` | execute integration |
| `npm run integration`| execute integration |
