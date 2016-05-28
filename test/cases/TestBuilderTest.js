(function (node) {
    "use strict";

    var main = node? global: window;

    var gabarito;
    var parts;

    if (node) {
        gabarito = require("../../lib/gabarito");
        parts = require("../../deps/parts");
    } else {
        gabarito = main.gabarito;
        parts = gabarito.parts;
    }

    var assert = gabarito.assert;
    var g;

    gabarito.test("gabarito.TestBuilder").

    before(function () {
        g = gabarito.standalone();
    }).

    clause("gabarito.test should add a test with the given name").
    clause("should use the name as the test's name").
    clause("should use the function as before within the test").
    clause("should use the function as after within the test").
    clause("should add the clause as a new clause within the test");

}(typeof exports !== "undefined" && global.exports !== exports));
