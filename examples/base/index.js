/**
 * This file is only a proxy for src/index, so it can be required by either
 * JavaScript or TypeScript code.
 *
 * If running code through `ts-node` it'll require src/index.ts. If running from
 * a nodejs environment it'll require src/index.js,
 * which is generated via compilation.
 */

module.exports = require('./src/');
