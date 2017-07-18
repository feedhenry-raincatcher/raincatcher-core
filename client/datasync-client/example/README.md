### Running example

Example needs to run in browser environment.

#### Steps to run example

Install required packages

    npm install browserify
    npm install typescript
    npm install tsify
    npm install browserify-shim

Build single sync bundle.

    browserify --debug index.ts -p [ tsify --noImplicitAny ] > bundle.js

Run index.html file in your browser
