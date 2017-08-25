#!/bin/bash
set -ev
npm run clean
lerna bootstrap
npm run build
npm run clean:dependencies
lerna bootstrap --hoist='' -- --only=production --registry='https://registry.npmjs.org/'
