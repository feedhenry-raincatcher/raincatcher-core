# RainCatcher
Feedhenry RainCatcher Core Repository

## Folder Structure

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
[`examples/base`](./examples/base/README.md), which is a sample base thatcontains the skeleton
expected of a new package. Refer to the linked README for mor details.
