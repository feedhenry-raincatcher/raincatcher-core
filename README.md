# RainCatcher
Feedhenry RainCatcher Core Repository

## About RainCatcher

## Developing

RainCatcher supports and is tested on Node.JS@4 and should run on latest LTS.

Check your Node.JS version running `node -v`

### Setup

```bash
git clone https://github.com/feedhenry-raincatcher/raincatcher-core.git
cd raincatcher
npm install -g lerna
npm install
lerna bootstrap
```

## Repository folder structure

This repository contains many subpackages managed through [Lerna](https://lernajs.io/), and they're
contained in the following directories:

<dl>
  <dt>client/</dt>
  <dd>Front-end packages, from API clients to user interface modules</dd>

  <dt>cloud/</dt>
  <dd>Cloud app packages, intended to be run on an Node.JS environment</dd>

  <dt>demo/</dt>
  <dd>Full-fledged Demo applications, showcasing the usage of multiple modules</dd>

  <dt>examples/</dt>
  <dd>Smaller examples and templates for other packages in the repository</dd>
</dl>

## Creating a new package

In order to create a new package, we recommend duplicating
[`examples/base`](./examples/base/README.md), which is a sample base that contains the skeleton
expected of a new package. Refer to the linked README for more details.

## Package structure

### Directories

<dl>
  <dt>src/</dt>
  <dd>Contains the TypeScript sources.</dd>

  <dt>lib/</dt>
  <dd>Output directory for the compiled JavaScript and source maps. Make sure to setup the `npm build` script to copy over any other files that are required by the module, since the TypeScript compiler will only deal with ts/tsx files.</dd>

  <dt>test/</dt>
  <dd>The unit tests for the module. Should contain a `mocha.opts` file for configuring Mocha.</dd>

  <dt>coverage/ and .nyc_output</dt>
  <dd>Istanbul output, should be .gitignored.</dd>
</dl>

### Module structure

#### Default exports

#### Public interface

#### Unit test structure

#### Reusable tests
