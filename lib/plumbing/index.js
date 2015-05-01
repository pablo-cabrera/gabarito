"use strict";

[

    "Runner",

    "Reporter",
    "ConsoleReporter",
    "JUnitXmlReporter",

    "Environment",
    "NodeEnvironment",
    "SeleniumEnvironment",
    "VBoxSeleniumEnvironment"

].forEach(function (r) {
    module.exports[r] = require("./" + r);
});