#!/bin/bash
set -ev
rm -rf node_modules
npm install
npm run clean
npm run bootstrap
npm run build
npm run clean
rm -rf node_modules
lerna bootstrap --hoist=''
lerna exec -- npm shrinkwrap
