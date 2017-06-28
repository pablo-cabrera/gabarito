"use strict";

var cwd = process.cwd();
var root = cwd + "/test/coverage/instrument";
if (!require("fs").existsSync(root)) {
    root = cwd;
}

var gabarito = require("../../../lib/gabarito");
var parts = require("../../../deps/parts");

var JUnitXmlReporter = require(root + "/lib/plumbing/JUnitXmlReporter");
var Environment = require("../../../lib/plumbing/Environment");

var DummyEnvironment = Environment.descend().
proto({
    getName: parts.constant("dummy")
});

var assert = gabarito.assert;
var spy = gabarito.spy;
var matcher = gabarito.matcher;

var file;
var testName;
var xmlbuilder;
var fs;
var nowGiver;

var reporter;
var env;



gabarito.test("gabarito.plumbing.JUnitXmlReporterTest").

before(function () {
    file = "file";
    testName = "name";
    xmlbuilder = null; // we'll use the actual builder for this one
    fs = { writeFileSync: spy() };
    nowGiver = parts.constant(0);

    reporter = new JUnitXmlReporter(file, testName, xmlbuilder, fs, nowGiver);

    env = new DummyEnvironment();
}).

clause(
"finish should write the file with the XML containint the test results",
function () {
    var result = {
        environment: env,
        results: [
            {
                test: "test",
                start: 0,
                end: 2,
                results: {
                    "clause": {
                        start: 0,
                        elapsedTime: 1
                    }
                }
            }
        ]
    };

    reporter.start();

    reporter.finish([result]);

    fs.writeFileSync.verify().args(
        file,
        "<?xml version=\"1.0\"?>\n" +
        "<testsuites name=\"name\" time=\"0\" tests=\"1\" failures=\"0\">\n" +
        "  <testsuite name=\"dummy\" tests=\"1\" failures=\"0\" " +
                "time=\"0.002\">\n" +

        "    <testcase name=\"(dummy) test#clause\" time=\"0.001\" " +
                "classname=\"test\"/>\n" +

        "  </testsuite>\n" +
        "</testsuites>");

    fs.writeFileSync.noCalls();
});
