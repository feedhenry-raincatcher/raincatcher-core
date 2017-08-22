#!/bin/bash
## Script for generating core modules documentation

VERSION=0.0.1
DOC_FOLDER=docs
DOCS_LOCATION=$DOC_FOLDER/api
DOC_PATH=../../$DOCS_LOCATION
DOCS_BRANCH=api-docs-update-$VERSION

echo "Clean previous docs folders and documentation git repository"
npm run clean:docs

echo "Cloning docs repository"
git clone --depth 1 git@github.com:feedhenry-raincatcher/raincatcher-docs.git $DOC_FOLDER

echo "Generate documentation for packages"
lerna exec --ignore @raincatcher/logger --ignore @raincatcher/demo-server  -- typedoc --out docs/ --excludePrivate --excludeExternals --theme minimal

echo "Copy documentation"
lerna exec --ignore @raincatcher/logger --ignore @raincatcher/demo-server --  mkdir -p $DOC_PATH/\$LERNA_PACKAGE_NAME
lerna exec --ignore @raincatcher/logger --ignore @raincatcher/demo-server --  cp -Rf ./docs $DOC_PATH/\$LERNA_PACKAGE_NAME

echo "Rename root folder"
cd $DOCS_LOCATION
mv @raincatcher $VERSION

echo "Pushing changes to github"
cd $DOC_FOLDER
git checkout -b $DOCS_BRANCH
git add --all
git commit -m"RainCatcher API update $VERSION"
git push origin +$DOCS_BRANCH:$DOCS_BRANCH

echo "Creating pull request using hub."
echo "If you do not have hub installed do that manually"
hub compare $DOCS_BRANCH 2> /dev/null
