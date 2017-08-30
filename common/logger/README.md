# RainCatcher Logger Cloud

This module creates logging facade for node.js based applications that
is used by all RainCatcher modules. Users can use their own loggers by
wrapping them into provided interface.

## Enabling logging

By default all RainCatcher framework modules will not log any information to console.
Framework users can enable logger by using one of the provided implementations or
custom implementation that will extend our interface.

Supported implementations:
- `BunyanLogger`
Implements [Bunyan](https://www.npmjs.com/package/bunyan)
Used for server side logging
- `ClientLogger`
Implements [LogLevel](https://github.com/pimterry/loglevel)
Used for client (web and mobile) logging

```typescript
  // Setup logger in your application
  import {BunyanLogger, getLogger} from '@raincatcher/logger';
  const log = new BunyanLogger({name: 'index'});;
  setLogger(log);

  // Use logger in other modules
  getLogger().info('This log will render with BunyanLogger');
```

See `./example/index.ts` for more advanced usages
