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

  <dt>test/</dt>
  <dd>The unit tests for the module. Should contain a `mocha.opts` file for configuring Mocha.</dd>

  <dt>coverage/ and .nyc_output</dt>
  <dd>Istanbul output, should be .gitignored.</dd>
</dl>

### Module structure

RainCatcher modules are written in [TypeScript](http://typescriptlang.org).

The main files are modules that by default export a class containing the main implementation for the module's intent,
with a named export containing a public interface that should be depended upon, and reimplemented.

```typescript
import Implementation, { PublicInterface } from '@raincatcher/module';
```

See the [Reusing unit tests](#reusing-unit-tests) section in order to know how to leverage the existing test suites on
custom implementations.

#### Default exports

For each module, the default export is the main implementation itself, as the most common scenario is it being used by
the requiring code.

Other RainCatcher modules depend only on the interfaces explained in the [next section](#public-interface)

#### Public interface

Along with the default export, all modules include a public interface definition that are depended upon by other
RainCatcher modules instead of depending on the implementation itself.
See the [BaseModule](examples/base/src/index.ts) for an example.

This is done so they can be more easily replaced or extended by custom implementations.
Custom modules can skip this concern.

#### Unit test structure

For each module unit tests are present on the `test/` folder, the Mocha default for storing the `mocha.opts` file as well.

Since code that requires a module's tests are most likely interested in a reusable test suite, the `test/index.ts` file's default export should be a function that receives all the required parameters for running the test suite on a given implementation of the interface.

```typescript
import publicInterfaceTestSuite from '@raincatcher/module/test';
import { PublicInterface } from '@raincatcher/module';

class MyClass implements PublicInterface {
  // ...
}

// test/MyClass.ts
describe('MyClass', function() {
  publicInterfaceTestSuite(MyClass);
});
```

Tests for the module's specific implementation can be included as other files inside the same folder.

### Using modules from JavaScript

We recommend users to write their code in TypeScript, especially if their new RainCatcher-based solution is a greenfield project, however JavaScript usage is partially supported by editor plugins that will still offer suggestions based on the TypeScript interfaces and access to jsdoc annotations:

![JS completion through editor support](img/js-completion.png)

See the example on [examples/js]() for more information also for reusing the unit test suites from JavaScript code.

### Repository commands

 `npm run test` - run unit tests

 `npm run bootstrap` - perform boostrap for all modules

 `npm run start` - run top level applications

 `npm run lint` - execute tslint for all modules

 `npm run cleanInstall` - perform install without executing additional scripts
