'use strict';
/**
 * Module dependencies.
*/
import app from './app';
import * as http from 'http';

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || 3000;
app.set('port', port);

/**
 * Create HTTP server.
 */
var server = http.createServer(app);

/**
 * Listen on provided port,on all network interfaces.
 */
server.listen(port, onListening);
server.on('error', onError);

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error: any) {
  if (error.syscall != 'listen') {
    throw error;
  }
  if (error.code === 'EADDRINUSE') {
    console.error(error.port + ' port number is already in use');
    return process.exit(1);
  }
  throw error;
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  var addr = server.address();
  console.log('Listening on ' + addr.port);
}
