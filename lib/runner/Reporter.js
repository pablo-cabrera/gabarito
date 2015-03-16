"use strict";

var Reporter = function () {
};

Reporter.prototype.begin = function (env, sketches) {
};

Reporter.prototype.end = function (env, results) {
};

Reporter.prototype.pass = function (env, sketch, draft, result) {
};

Reporter.prototype.fail = function (env, sketch, draft, result) {
};

Reporter.prototype.dispatch = function (env) {
};

Reporter.prototype.done = function (env) {
};

module.exports = Reporter;