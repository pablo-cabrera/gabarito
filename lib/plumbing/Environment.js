"use strict";

var root = "../..";
var parts = require(root + "/deps/parts");
var ilk = require(root + "/deps/ilk");

module.exports = ilk().
proto({

    getName: parts.constant("unknown"),

    dispatch: function (files, reporters, done) {
        throw new Error("Unimplemented method");
    }
});
