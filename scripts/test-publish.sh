#!/bin/bash
set -e
containerId=$(docker run -itd -p 0:4873 verdaccio/verdaccio)

# get random assined port
port=$(docker port $containerId | awk -F ':' '{print $2}')
echo "Started local npm registry"
registry="http://localhost:$port"

# adduser doesn't allow cli params, use stdin hack
npm adduser --registry=$registry <<EOF
test-user
testPwd
test@test.com
EOF

echo "Beginning publish test"
npm run publish:prepare
lerna publish --skip-git --canary --yes --registry=$registry

echo "Publishing finished, reverting version changes..."
git checkout cloud/ demo/ client/

# kill container if in CI, else open in browser
# travis sets CI=true by default
if [ -n "$CI" ];
then
  echo "Removing npm registry container"
  docker kill $containerId
  docker rm $containerId
else
  # cross-platform `open` command
  # requires `npm i -g opn-cli` if not running as npm script
  opn $registry
fi
