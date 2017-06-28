(function (node) {
    "use strict";

    var main;
    var gabarito;

    if (node) {
        main = global;
        gabarito = require("../../lib/gabarito");
    } else {
        main = window;
        gabarito = main.gabarito;
    }

    gabarito.on("complete", function () {
        gabarito.message("grunt-istanbul",
                JSON.stringify(main["__coverage__"]));
    });

}(typeof exports !== "undefined" && global.exports !== exports));
