'use strict';
/**
 * Module dependencies.
 */
import {  BunyanLogger, logger, setLogger} from '@raincatcher/logger';
setLogger(new BunyanLogger({name: 'Demo application', level: 'info'}));
import * as http from 'http';
import app from './app';

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || 3000;
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
    logger.error(error.port + ' port number is already in use', {tag: 'demo:server:src'});
    return process.exit(1);
  }
  throw error;
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  const addr = server.address();
  logger.info('Listening on ' + addr.port, {tag: 'demo:server:src'});
}
