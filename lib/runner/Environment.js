"use strict";

var parts = require("parts");

module.exports = parts.type().
proto({

    getName: parts.constant("unknown"),

    dispatch: function (files, reporters, done) {
        throw new Error("Unimplemented method");
    }
});