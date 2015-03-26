(function (node) {
    "use strict";

    var main = node? global: window;

    var gabarito;
    var parts;

    if (node) {
        gabarito = require("../../lib/gabarito");
        parts = require("parts");
    } else {
        gabarito = main.gabarito;
        parts = main.parts;
    }

    var assert = gabarito.assert;

    gabarito.add({
        name: "gabarito.AssertTest",

        "areEqual should use the equality function to compare values": function () {
            var a = {};
            var b = {};
            var f = function (c, d) {
                assert.areSame(a, c);
                assert.areSame(b, d);

                return true;
            };

            assert.areEqual(a, b, f);
        },

        "areEqual should throw the error with the given message": function () {
            var msg = "yomomma";
            try {
                assert.areEqual(1, 2, parts.constant(false), msg);
            } catch (e) {
                assert.areSame(msg, e.message);
            }
        }
    });

}(typeof exports !== "undefined" && global.exports !== exports));