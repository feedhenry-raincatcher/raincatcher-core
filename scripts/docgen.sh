#!/bin/bash
## Script for generating core modules documentation

VERSION=1.0.0
DOC_FOLDER=docs
DOCS_LOCATION=$DOC_FOLDER/api
DOC_PATH=../../$DOCS_LOCATION
DOCS_BRANCH=api-docs-update-$VERSION

echo "Clean previous docs folders and documentation git repository"
npm run clean:docs

echo "Cloning docs repository"
git clone --depth 1 git@github.com:feedhenry-raincatcher/raincatcher-docs.git $DOC_FOLDER

echo "Generate documentation for packages"
lerna exec --ignore @raincatcher/demo-server  -- typedoc --out docs/ --excludePrivate --excludeExternals --theme minimal

echo "Copy documentation"
lerna exec --ignore @raincatcher/demo-server --  mkdir -p $DOC_PATH/\$LERNA_PACKAGE_NAME
lerna exec --ignore @raincatcher/demo-server --  cp -Rf ./docs $DOC_PATH/\$LERNA_PACKAGE_NAME

echo "Rename root folder"
cd $DOCS_LOCATION
mv @raincatcher $VERSION

echo "Documentation was generated. Please continue website relase directly in documentation repository"
