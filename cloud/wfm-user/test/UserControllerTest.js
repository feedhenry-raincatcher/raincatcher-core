"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Bluebird = require("bluebird");
var chai = require("chai");
var chai_1 = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var index_1 = require("../src/index");
var testObj = { id: '1', name: 'Tom Smith' };
var listResponse = [testObj];
var MockRepository = (function () {
    function MockRepository() {
    }
    MockRepository.prototype.retrieveUsers = function (filter, limit) {
        return Bluebird.resolve(listResponse);
    };
    return MockRepository;
}());
describe('FeedHenry User Controller Tests', function () {
    var testSubject;
    beforeEach(function () {
        testSubject = new index_1.UserController(new MockRepository());
    });
    describe('ApiController routes creation', function () {
        it('verify list middleware', function () {
            var request = {
                query: {
                    filter: 'Tom'
                }
            };
            return testSubject.listUsersHandler(request).then(function (data) {
                return chai_1.expect(data).to.equal(listResponse);
            });
        });
        it('verify list middleware fails on missing filter', function () {
            var request = {
                query: {
                    filter: ''
                }
            };
            return testSubject.listUsersHandler(request).catch(function (err) {
                // tslint:disable-next-line:no-unused-expression
                chai_1.expect(err).to.not.empty;
            });
        });
    });
    it('verify route creation', function () {
        // tslint:disable-next-line:no-unused-expression
        var router = testSubject.buildRouter();
        chai.assert(router);
    });
});
//# sourceMappingURL=UserControllerTest.js.map