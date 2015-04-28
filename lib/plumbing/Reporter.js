"use strict";

var parts = require("parts");

module.exports = parts.type().
proto({
    start: function () {},
    finish: function (results) {},
    init: function (env, tests) {},
    complete: function (env, results) {},
    begin: function (env, test) {},
    end: function (env, results) {},
    enter: function (env, test, clause) {},
    pass: function (env, test, clause, result) {},
    fail: function (env, test, clause, result) {},
    dispatch: function (env) {},
    done: function (env, results) {},
    say: function (env) {}
});