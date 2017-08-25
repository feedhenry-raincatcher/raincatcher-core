#!/bin/bash
set -ev
npm run clean
# use devDependencies + hoisting for successful building
lerna bootstrap -- --no-shrinkwrap
npm run build

npm run clean:dependencies
# install only prod dependencies and update lock files
lerna bootstrap --hoist='' -- --only=production --registry='https://registry.npmjs.org/'
