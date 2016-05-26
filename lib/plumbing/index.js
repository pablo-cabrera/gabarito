"use strict";

[

    "Runner",

    "Reporter",
    "ConsoleReporter",
    "JUnitXmlReporter",

    "Environment",
    "NodeEnvironment",
    "ServerEnvironment",
    "PhantomEnvironment"

].forEach(function (r) {
    module.exports[r] = require("./" + r);
});
