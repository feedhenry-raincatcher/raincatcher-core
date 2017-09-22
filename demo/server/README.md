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

- mongodb installed and running on port 27017
URL controlled by `process.env.MONGO_CONNECTION_URL` and `config-{env}.json` file.
- redis installed and running on port 6379
URL controlled by `process.env.REDIS_CONNECTION_URL` and `config-{env}.json` file.

## Configuration

Demo offers different configuration profiles depending on where application will be deployed.

- config-dev.js (for developer/local setup - used by default)
- config-prod.js (for production uses)

Profiles can be changed using `process.env.CONFIG_PROFILE` variable.
For example:
```
// use production profile.
process.env.CONFIG_PROFILE === 'prod'
// it will load config-prod.js file in top level application
```

### Configuring custom query parameters for mobile clients

Mobile clients based on the sync framework might not require to receive all WorkOrders in order to operate.

To save on local memory usage, data traffic and improve performance, additional filters can be added to limit those.

In this sample implementation, WorkOrders that are in a complete state stop being sent to mobile clients after two days of their completion. This can be configured via the `sync.daysToExcludeCompleteWorkorders` configuration key. It illustrates a way to include a relatively complex MongoDB query filter into the chain that is used by the list handler for the sync framework.