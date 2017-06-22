# RainCatcher Logger Cloud

This module creates logging facade for node.js based applications that is used by all Raincatcher modules.
Users can use their own loggers by wrapping them into provided interface.
By default module provides [Bunyan](https://www.npmjs.com/package/bunyan) and Console loggers implementations.


## Quick start

Import the your logger implementation and the Logger interface to be used.
```typescript
  import {BunyanLogger, Logger} from '@raincatcher/logger-cloud';

  // constructor needs at least name
  const log: Logger = new BunyanLogger({name: 'index'});

  log.info('info logger message', {test: 'info object'});
```

See `./integration/index.ts` for usage


