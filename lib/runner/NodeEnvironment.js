"use strict";

var util = require("util");
var gabarito = require("../gabarito");

var Environment = require("./Environment");

var NodeEnvironment = function () {
    this.name = "Node.js";
};

util.inherits(NodeEnvironment, Environment);

var attachReporter = function (env, reporter) {
    gabarito.on("begin", function (sketches) {
        reporter.begin(env, sketches);
    });

    gabarito.on("end", function (results) {
        reporter.end(env, results);
    });

    gabarito.on("pass", function (sketch, draft, result) {
        reporter.pass(env, sketch, draft, result);
    });

    gabarito.on("fail", function (sketch, draft, result) {
        reporter.fail(env, sketch, draft, result);
    });
};

var loadFile = function (file) {
    require(file);
};

NodeEnvironment.prototype.dispatch = function (files, reporters, done) {
    var that = this;
    gabarito.reset();

    reporters.forEach(function (r) { attachReporter(that, r); });
    files.forEach(loadFile);

    reporters.forEach(function (r) { r.dispatch(that); });

    gabarito.attest(function (results) {
        reporters.forEach(function (r) { r.done(that, results); });
        done(results);
    });
};

module.exports = NodeEnvironment;