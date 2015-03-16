"use strict";

var Environment = function () {
    this.name = "unknown";
};

Environment.prototype.dispatch = function (files, reporters, done) {
    throw new Error("Unimplemented method");
};

module.exports = Environment;