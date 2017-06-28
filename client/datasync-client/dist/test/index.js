"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference types="mocha" />
var index_1 = require("../src/index");
describe('Client Tests', function () {
    describe('#test api', function () {
        it('api should be available', function () {
            if (!index_1.default.doList) {
                throw new Error('Api not mounted');
            }
        });
    });
});
//# sourceMappingURL=index.js.map