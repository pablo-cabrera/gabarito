"use strict";

var parts = require("parts");

module.exports = parts.type(function () {
    this.name = "unknown";
}).
proto({
    dispatch: function (files, reporters, done) {
        throw new Error("Unimplemented method");
    }
});