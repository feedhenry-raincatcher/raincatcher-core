'use strict';
/**
 * Module dependencies.
 */
import { BunyanLogger, getLogger, setLogger } from '@raincatcher/logger';
import appConfig from './util/Config';
const config = appConfig.getConfig();
setLogger(new BunyanLogger(config.bunyanConfig));
import * as http from 'http';
import app from './app';

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || 8001;
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port,on all network interfaces.
 */
server.listen(port, onListening);
server.on('error', onError);

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error: any) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  if (error.code === 'EADDRINUSE') {
    getLogger().error(error.port + ' port number is already in use');
    return process.exit(1);
  }
  throw error;
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  const addr = server.address();
  getLogger().info('Listening on ' + addr.port);
}
