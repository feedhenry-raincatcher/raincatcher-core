# RainCatcher Cloud Demo application

Reference/demo implementation of the cloud application of a RainCatcher project.

## Running

Cloud application can be launched using

    npm run start

If you wish to run cloud application along with other demo applications please execute this command on top level application.Application was generated from [base application](../../examples/base) template

## Debugging

Execute

    grunt debug

When process start you can connect to it using ide of your choice.

## Prerequisites

- mongodb installed and running on port 27017.
- redis installed and running on port 6379

## Configuration

Demo offers different configuration profiles depending on where application will be deployed.

- config-dev.json (for developer/local setup - used by default)
- config-prod.json (for production uses)

Profiles can be changed using `process.env.CONFIG_PROFILE` variable.
For example:
```
// use production profile.
process.env.CONFIG_PROFILE === 'prod'
// it will load config-prod.json file in top level application
```
