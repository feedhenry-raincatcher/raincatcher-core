#!/bin/bash
## Script for generating core modules documentation

VERSION=1.1.0
DOC_FOLDER=docs
DOCS_LOCATION=${PWD}/$DOC_FOLDER/api

echo "Generate documentation for packages"
lerna exec --ignore @raincatcher/demo-server  -- typedoc --mode modules --out $DOCS_LOCATION/\$LERNA_PACKAGE_NAME --excludePrivate --excludeExternals --theme minimal src/

echo "Rename root folder"
mv $DOCS_LOCATION/@raincatcher $DOCS_LOCATION/$VERSION

echo "Documentation was generated. Please continue website relase directly in documentation repository"
