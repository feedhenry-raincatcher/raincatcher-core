#!/bin/bash
set -ev

# remove core's node_modules to avoid compilation issues from hoisting
rm -rf "$(dirname $(readlink -f $0))/../node_modules"

npm install
npm run clean
# use devDependencies + hoisting for successful building
lerna bootstrap -- --no-shrinkwrap
npm run build

npm run clean:dependencies
# install only prod dependencies and update lock files
lerna bootstrap --hoist='' -- --only=production --registry='https://registry.npmjs.org/'
