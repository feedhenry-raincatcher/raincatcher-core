# RainCatcher BaseModule

This is a template for modules in the RainCatcher project, it contains the default dotfiles and other configuration files for the development tooling and the directory structure spected from individual modules.

RainCatcher code is written in [TypeScript](http://typescriptlang.org), uses [Mocha](https://mochajs.org/) for unit tests and [Istanbul](https://istanbul.js.org/) for test coverage checks.

For an explanation of the expected internals of see the [main README](../../README.md#package-structure)

## Using this template

When creating a new module, copy the entire contents of this folder and make the following adjustments to [`package.json` ](./package.json):

  - `name`: Update to new package's name
  - `version`: Set it to your new intended semver (i.e. `0.0.0` or `1.0.0`)
  - `description`: Remove the description that contains
  - `author`: Update to reflect possible new author
  - `dependencies`: Remove the sample dependency on `@raincatcher/example-base`

### Removing unit tests

In order to remove all of the existing unit test sample setup, make the following alterations:

- Remove the contents of the `test/` folder.
- Remove the test-related `devDependencies`: mocha, source-map-support and nyc
- Remove the test, debug and debug-legacy scripts.
- Remove the `"nyc"` extra configuration key from `package.json`
