'use strict';
/**
 * Module dependencies.
 */
import { LoggerManager, ConsoleLogger } from '@raincatcher/logger';
import * as http from 'http';
import app from './app';

const log = new LoggerManager();
log.logger = new ConsoleLogger();
log.setLogger(log.logger);

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
    log.logger.error(error.port + ' port number is already in use');
    return process.exit(1);
  }
  throw error;
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  const addr = server.address();
  // tslint:disable-next-line:no-console
  log.logger.info('Listening on ' + addr.port);
}
