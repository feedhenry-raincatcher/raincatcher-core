"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = require("@raincatcher/logger");
var wfm_rest_api_1 = require("@raincatcher/wfm-rest-api");
var Bluebird = require("bluebird");
var express = require("express");
var INVALID_FILTER_ERROR = 'InvalidFilter';
var DEFAULT_QUERY_LIMIT = 10;
/**
 * Express based controller for user related operations
 */
var UserController = (function () {
    function UserController(repository) {
        this.repository = repository;
    }
    /**
     * Handler using `UsersRepository` to fetch list of the users
     */
    UserController.prototype.listUsersHandler = function (req) {
        logger_1.getLogger().debug('Api list method called', { body: req.query });
        if (!req.query.filter) {
            logger_1.getLogger().debug('Invalid filter passed');
            var error = new wfm_rest_api_1.ApiError(INVALID_FILTER_ERROR, 'Missing user filter', 400);
            return Bluebird.reject(error);
        }
        var limit = req.query.limit || DEFAULT_QUERY_LIMIT;
        return this.repository.retrieveUsers(req.query.filter, limit);
    };
    /**
     * Build all routes and return new router instance
     */
    UserController.prototype.buildRouter = function () {
        var self = this;
        var router = express.Router();
        logger_1.getLogger().info('User web api initialization');
        router.route('/')
            .get(function (request, response, next) {
            self.listUsersHandler(request).then(function (data) {
                return response.json({ users: data });
            }).catch(next);
        });
        return router;
    };
    return UserController;
}());
exports.UserController = UserController;
//# sourceMappingURL=UserController.js.map