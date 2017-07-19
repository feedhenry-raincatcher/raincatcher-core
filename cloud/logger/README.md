# RainCatcher Logger Cloud

This module creates logging facade for node.js based applications that
is used by all Raincatcher modules. Users can use their own loggers by
wrapping them into provided interface. By default the logger is set to
an empty logger which returns nothing. There are Two modules provide
[Bunyan](https://www.npmjs.com/package/bunyan) and Console loggers
implementations.


## Quick start

Import the your logger implementation and the Logger interface to be used.
```typescript
  import {BunyanLogger, logger} from '@raincatcher/logger';

  // you can instantiate the default logger with any Logger implementation to change the global logger

  const log = new BunyanLogger({name: 'index'});;
  setLogger(log);

  logger.info('This log will render with BunyanLogger');

```

See `./integration/index.ts` for usage


