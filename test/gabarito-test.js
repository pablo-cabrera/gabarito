(function (node) {
    "use strict";

    var main = node? global: window;

    var gabarito;
    var parts;

    if (node) {
        gabarito = require(process.cwd()+ "/cover/gabarito");
        parts = require("parts");
    } else {
        gabarito = main.gabarito;
        parts = main.parts;
    }

    var assert = gabarito.assert;

    var s = {
        "name": "sketch name",

        "should go fuck yourself": function () {
            throw new Error("go fuck yourself");
        },
        "some other crap": function () {
            gabarito.stay(500);
        },

        "some shit": function () {
        },

        "dual stay": function () {
            gabarito.stay();
            gabarito.stay();
        },

        "go without stay": function () {
            gabarito.go();
        },

        "stay and go": function () {
            gabarito.stay();
            setTimeout(gabarito.going(), 500);
        }
    };

    gabarito.sketch(s);

}(typeof exports !== "undefined" && global.exports !== exports));