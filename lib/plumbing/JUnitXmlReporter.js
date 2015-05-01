"use strict";

var root = "../..";
var parts = require(root + "/deps/parts");
var ilk = require(root + "/deps/ilk");
var xmlbuilder = require("xmlbuilder");
var fs = require("fs");
var Reporter = require("./Reporter");


module.exports = ilk.tokens(function (
    myFile,
    myName,
    start,

    buildTestSuites,
    buildTestSuite,
    buildTestCases
) {

    return Reporter.descend(function (file, name) {
        myFile.mark(this, file);
        myName.mark(this, name);
    }).

    proto(buildTestSuites, parts.that(function (that, results) {
        var testsuites = xmlbuilder.create("testsuites");

        if (this[myName]) {
            testsuites.att("name", this[myName]);
        }

        var tests = 0;
        var failures = 0;

        testsuites.att("time", (Date.now() - this[start]) / 1000);
        results.forEach(function (results) {
            that[buildTestSuite](testsuites, results);

            results.results.forEach(function (r) {
                parts.forEach(r.results, function (r) {
                    tests += 1;
                    if (r.error) {
                        failures += 1;
                    }
                });
            });
        });

        testsuites.att("tests", tests);
        testsuites.att("failures", failures);

        return testsuites;
    })).

    proto(buildTestSuite, parts.that(function (that, testSuites, results) {
        var env = results.environment.getName();
        var testSuite = testSuites.ele("testsuite");
        testSuite.att("name", env);

        var tests = 0;
        var failures = 0;
        var time = 0;

        results.results.forEach(function (r) {
            that[buildTestCases](env, testSuite, r);

            time += r.elapsedTime;

            parts.forEach(r.results, function (r) {
                tests += 1;
                if (r.error) {
                    failures += 1;
                }
            });
        });

        testSuite.att("tests", tests);
        testSuite.att("failures", failures);
        testSuite.att("time", time / 1000);
    })).

    proto(buildTestCases, parts.that(function (that, env, testSuite, results) {
        parts.forEach(results.results, function (r, p) {
            var testCase = testSuite.ele("testcase");
            testCase.att("name", "(" + env + ") " + results.test.name + "#" + p);
            testCase.att("time", r.elapsedTime / 1000);
            testCase.att("classname", results.test.name);

            if (r.error) {
                var failure = testCase.ele("failure");
                failure.att("message", r.error.message);

                if (r.error.stack) {
                    var systemErr = testCase.ele("system-err");
                    systemErr.txt(r.error.stack);
                }
            }
        });
    })).

    proto({
        start: function () {
            this[start] = Date.now();
        },

        finish: function (results) {
            var testsuites = this[buildTestSuites](results);
            fs.writeFileSync(this[myFile], testsuites.end({ pretty: true }));
        }
    });
});