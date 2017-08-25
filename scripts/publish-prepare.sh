#!/bin/bash
set -ev
npm run clean
lerna bootstrap
npm run build
npm run clean:dependencies
lerna bootstrap --hoist=''
lerna exec -- npm shrinkwrap
