"use strict";

var util = require("util");
var Reporter = require("./Reporter");

var JUnitXmlReporter = function () {
};

util.inherits(JUnitXmlReporter, Reporter);

JUnitXmlReporter.prototype.done = function (env, results) {
};

module.exports = JUnitXmlReporter;