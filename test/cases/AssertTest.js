(function (node) {
    "use strict";

    var main = node? global: window;

    var gabarito;
    var parts;

    if (node) {
        var root = "../../test/coverage/instrument";
        if (!require("fs").existsSync(root)) {
            root = "../..";
        }

        gabarito = require(root + "/lib/gabarito");
        parts = require("../../deps/parts");
    } else {
        gabarito = main.gabarito;
        parts = gabarito.parts;
    }

    var assert = gabarito.assert;

    gabarito.test("gabarito.AssertTest").

    clause("areEqual should use the equality function to compare values",
    function () {
        var a = {};
        var b = {};
        var f = function (c, d) {
            assert.areSame(a, c);
            assert.areSame(b, d);

            return true;
        };

        assert.areEqual(a, b, f);
    }).

    clause("areEqual should throw the error with the given message",
    function () {
        var msg = "yomomma";
        try {
            assert.areEqual(1, 2, parts.constant(false), msg);
        } catch (e) {
            assert.areSame(msg, e.message);
        }
    });

}(typeof exports !== "undefined" && global.exports !== exports));
