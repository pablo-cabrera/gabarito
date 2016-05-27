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

    gabarito.test("gabarito.TestBuilder").

    clause("gabarito.test should add a test with the given name", function () {
        assert.fail();
    }).

    clause("should use the name as the test's name", function () {
        assert.fail();
    }).

    clause("should use the function as before within the test", function () {
        assert.fail();
    }).

    clause("should use the function as after within the test", function () {
        assert.fail();
    }).

    clause("should add the clause as a new clause within the test",
    function () {
        assert.fail();
    });


}(typeof exports !== "undefined" && global.exports !== exports));
